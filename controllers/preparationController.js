const Theme = require('../models/themes');
const Reading = require('../models/readings');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
require('dotenv').config();

// All user has access to preparation themes.
const allUserHasAccess = true;

const createSendThemeId = (themeWithReadings, statusCode, res) => {
  const themeId = themeWithReadings._id;
  const now = new Date();
  const cookieOptions = {
    expires: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('themeId', themeId, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    themeId,
    data: {
      themeWithReadings,
    },
  });
};

exports.getAllThemes = factory.getAll(Theme, allUserHasAccess);

exports.themeWithReadings = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;
  const passcode = req.body.passcode;

  const theme = await Theme.findById(themeId);
  if (!theme) {
    return next(new AppError('No theme found with that ID', 404));
  }

  if (theme.passcode !== passcode) {
    return next(new AppError('Passcode does not matched.', 401));
  }

  // Fetch the theme and populate the readingIds field with Reading documents
  const themeWithReadings = await Theme.findById(themeId).populate({
    path: 'readings',
    select: '-__v -voteCount',
  });

  createSendThemeId(themeWithReadings, 200, res);
});

exports.voteReading = catchAsync(async (req, res, next) => {
  const readingId = req.params.readingId;

  const reading = await Reading.findById(readingId);
  if (!reading) {
    return next(new AppError('Reading not found.', 404));
  }

  // Call the voteReading method and get the result
  const hasVoted = await req.user.voteReading(reading);

  let message;
  if (hasVoted) {
    // If the user voted, increment the vote count
    reading.voteCount += 1;
    message = 'Vote counted!';
  } else {
    // If the user unvoted, decrement the vote count
    reading.voteCount -= 1;
    message = 'Unvote counted!';
  }

  // to prevent negative values on the reading vote count.
  if (reading.voteCount < 0) {
    reading.voteCount = 0;
  }

  await reading.save();
  res.status(200).json({
    status: 'success',
    message,
  });
});

exports.themeWithReadingsWithVotes = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;
  const themeIdFromCookie = req.cookies.themeId;

  if (!themeIdFromCookie || themeIdFromCookie !== themeId) {
    return next(new AppError('You do not have access in this theme', 401));
  }

  // Fetch the theme and populate the readingIds field with Reading documents
  const themeWithReadings = await Theme.findById(themeId).populate({
    path: 'readings',
    select: '-__v',
  });

  res.status(200).json({
    status: 'success',
    data: {
      themeWithReadings,
    },
  });
});
