const Theme = require('../models/themes');
const Reading = require('../models/readings');
const Result = require('../models/result');
const User = require('../models/user');
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

exports.getThemesWithReadings = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;

  // const theme = await Theme.findById(themeId);

  // const themesReadings = await Reading.find({ themeId: themeId });

  // Fetch the theme and populate the readingIds field with Reading documents
  const themesWithReadings = await Theme.findOne({
    _id: themeId,
    userId: req.user.id,
  }).populate('readings');

  res.status(200).json({
    status: 'success',
    data: {
      themesWithReadings,
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

  // Delete all associated readings
  await Reading.deleteMany({ themeId: themeId });

  // Delete the theme
  await Theme.deleteOne({ _id: themeId });

  res
    .status(200)
    .json({ status: 'success', message: 'Theme successfully deleted!' });
});

exports.addReadingToTheme = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;
  const userId = req.user.id;

  const theme = await Theme.findOne({ _id: themeId, userId: userId });
  if (!theme) {
    return next(
      new AppError(
        'No theme found with that ID or you dont have permision to add reading to that theme.',
        404
      )
    );
  }

  const newReading = new Reading({
    reading: req.body.reading,
    category: req.body.category,
    voteCount: 0,
    themeId: theme.id,
    userId,
  });
  const savedReading = await newReading.save();

  // Update the Theme document to include the new Reading's ID
  await Theme.findByIdAndUpdate(
    themeId,
    { $push: { readingIds: savedReading._id } },
    { new: true } // Return the updated Theme document
  );

  res.status(200).json({
    status: 'success',
    data: {
      savedReading,
    },
  });
});

exports.deleteReading = catchAsync(async (req, res, next) => {
  const readingId = req.params.readingId;
  const userId = req.user.id;

  // Find and delete the result
  const preparationReading = await Reading.findOneAndDelete({
    _id: readingId,
    userId,
  });

  if (!preparationReading) {
    return next(
      new AppError(
        'Preparation reading not found or not authorized to delete.',
        404
      )
    );
  }

  res
    .status(200)
    .json({ status: 'success', message: 'Reading has been deleted.' });
});

exports.resetVotes = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;

  const theme = await Theme.findById(themeId);
  if (!theme) {
    return next(new AppError('No theme found with that ID.', 404));
  }

  // Find all readings associated with the specified themeId
  const readings = await Reading.find({ themeId: themeId });
  if (readings.length === 0) {
    return next(
      new AppError('No readings found for the specified theme ID', 404)
    );
  }

  // Update all readings to set voteCount to 0
  await Reading.updateMany({ themeId: themeId }, { $set: { voteCount: 0 } });

  res.status(200).json({
    status: 'success',
    data: {
      theme,
    },
  });
});

exports.preparationResults = catchAsync(async (req, res, next) => {
  const prepResults = await Result.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      prepResults,
    },
  });
});

exports.addpreparationResult = catchAsync(async (req, res, next) => {
  const {
    themeTitle,
    entranceSong,
    firstReading,
    firstPsalm,
    secondReading,
    secondPsalm,
    thirdReading,
    thirdPsalm,
    gospelReading,
    finalSong,
  } = req.body;

  const preparationResult = new Result({
    title: themeTitle,
    entranceSong,
    firstReading,
    firstPsalm,
    secondReading,
    secondPsalm,
    thirdReading,
    thirdPsalm,
    gospel: gospelReading,
    finalSong,
    userId: req.user._id,
  });

  const result = await preparationResult.save();

  // reset user votedReadings record
  await User.findByIdAndUpdate(
    req.user.id,
    { votedReadings: [] },
    {
      new: true, // Returns the updated document
      runValidators: false, // Avoid running validators
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.deleteResult = catchAsync(async (req, res, next) => {
  const resultId = req.params.resultId;
  const userId = req.user.id;

  // Find and delete the result
  const result = await Result.findOneAndDelete({
    _id: resultId,
    userId: userId,
  });

  // Check if the result was found and deleted
  if (!result) {
    return next(
      new AppError(
        'Preparation result not found or not authorized to delete.',
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Preparation result deleted successfully.',
  });
});
