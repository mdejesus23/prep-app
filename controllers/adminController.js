const Theme = require('../models/themes');
const Reading = require('../models/readings');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const ITEMS_PER_PAGE = 5;

exports.themes = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1; // if there is no query parameter the default value will be 1.
  let totalItems;

  const numThemes = await Theme.find({ userId: req.user.id }).countDocuments(); // Count all documents in the "Product" collection
  totalItems = numThemes; // total number of documents fetched in the database.

  const themes = await Theme.find({ userId: req.user._id })
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

exports.createTheme = catchAsync(async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const passcode = req.body.passcode;

  const theme = new Theme({
    title: title,
    description: description,
    passcode: passcode,
    userId: req.user.id,
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
    return next(new AppError('No theme found with that ID', 404));
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
  res
    .status(200)
    .json({ status: 'success', message: 'Theme successfully deleted!' });
});

exports.readings = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;

  const theme = await Theme.findById(themeId);
  if (!theme) {
    return next(new AppError('No theme found with that ID', 404));
  }

  const readings = await Reading.find({ themeId: themeId });

  res.status(200).json({
    status: 'success',
    data: {
      themeTitle: theme.title,
      readings,
    },
  });
});

exports.addReading = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;

  const theme = await Theme.findById(themeId);
  if (!theme) {
    return next(new AppError('No theme found with that ID', 404));
  }

  const reading = new Reading({
    reading: req.body.reading,
    category: req.body.category,
    voteCount: 0,
    themeId: theme.id,
  });

  await reading.save();
  res.status(200).json({
    status: 'success',
    data: {
      reading,
    },
  });
});

exports.deleteReading = catchAsync(async (req, res, next) => {
  const readingId = req.params.readingId;

  const reading = await Reading.findById(readingId);
  if (!reading) {
    return next(new AppError('No reading found with that ID', 404));
  }

  await Reading.deleteOne({ _id: readingId });

  res.status(200).json({ status: 'success' });
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
