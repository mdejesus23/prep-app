const Theme = require('../models/themes');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createTheme = catchAsync(async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const passcode = req.body.passcode;
  const readings = [];

  const theme = new Theme({
    title: title,
    description: description,
    passcode: passcode,
    readings: readings,
    //   userId: req.session.user,
  });

  const newTheme = await theme.save();
  res.status(201).json({
    status: 'success',
    data: {
      newTheme: newTheme,
    },
  });
});

exports.updateTheme = catchAsync(async (req, res) => {
  const { themeId } = req.params;

  const existingTheme = await Theme.findById(themeId);

  if (!existingTheme) {
    return next(new AppError('No tour found with that ID', 404));
  }

  const {
    title: updatedTitle,
    description: updatedDescription,
    passcode: updatedPasscode,
  } = req.body;

  existingTheme.title = updatedTitle;
  existingTheme.description = updatedDescription;
  existingTheme.passcode = updatedPasscode;

  await existingTheme.save();

  res.status(200).json({ message: 'item successfully updated!' });
});

exports.deleteTheme = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;

  const theme = await Theme.findById(themeId);

  if (!theme) {
    return next(new AppError('No theme found with that ID', 404));
  }

  await Theme.deleteOne({ _id: themeId });
  res.status(200).json({ message: 'Theme successfully deleted!' });
});

exports.addReading = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;

  const word = req.body.reading;
  const category = req.body.category;
  let initialVote = 0;

  if (!word) {
    return next(new AppError('Reading is not valid.', 404));
  }

  if (!category) {
    return next(new AppError('Category is not valid.', 404));
  }

  const theme = await Theme.findById(themeId);

  theme.readings.push({
    reading: word,
    category: category,
    voteCount: initialVote,
  });

  await theme.save();
  res.status(200).json({ message: 'Reading added successfuly!' });
});

exports.deleteReading = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;
  const readingId = req.params.readingId;

  const theme = await Theme.findById(themeId);

  if (!theme) {
    return next(new AppError('No theme found with that ID.', 404));
  }

  // need to assign to a new variable to get the return result thru filter method.
  const updatedReadings = theme.readings.filter((reading) => {
    return reading._id.toString() !== readingId.toString();
  });

  theme.readings = updatedReadings;
  await theme.save();
  res.status(200).json({ message: 'Success deleting reading' });
});

exports.resetVotes = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;

  const theme = await Theme.findById(themeId);
  if (!theme) {
    return next(new AppError('No theme found with that ID.', 404));
  }

  const updatedReadings = theme.readings.map((reading) => {
    return {
      ...reading,
      voteCount: 0,
    };
  });

  theme.readings = updatedReadings;
  await theme.save();

  res.status(200).json({
    message: 'Votes reset successfully',
    data: theme,
  });
});
