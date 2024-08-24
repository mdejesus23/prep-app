const Theme = require('../models/themes');
const Reading = require('../models/readings');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
require('dotenv').config();

const ITEMS_PER_PAGE = 5;

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

exports.getAllThemes = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1; // if there is no query parameter the default value will be 1.
  let totalItems;

  const numThemes = await Theme.find().countDocuments(); // Count all documents in the "Product" collection
  totalItems = numThemes; // total number of documents fetched in the database.

  const themes = await Theme.find()
    .skip((page - 1) * ITEMS_PER_PAGE) // Skip the previous pages with the items per page.
    .limit(ITEMS_PER_PAGE); // Limit the result to the current page's items

  res.status(200).json({
    status: 'success',
    results: themes.length,
    data: {
      themes,
    },
    pagination: {
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems, // true if the number of docs fetch is greater than ITEMS_PER_PAGE * page.
      hasPreviousPage: page > 1, // true if current page is greater than 1
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), //  Math.ceil() increase
    },
  });
});

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

  console.log(themeWithReadings);

  createSendThemeId(themeWithReadings, 200, res);
});

exports.voteReading = catchAsync(async (req, res, next) => {
  const readingId = req.params.readingId;

  const reading = await Reading.findById(readingId);
  if (!reading) {
    return next(new AppError('Reading not found.', 404));
  }

  const user = await req.user.voteReading(reading);

  let message;
  // add/minus vote count in the reading collection
  if (user.votedReadingIds.includes(readingId)) {
    reading.voteCount += 1;
    message = 'Vote counted!';
  } else {
    reading.voteCount -= 1;
    message = 'Unvote counted!';
  }

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
