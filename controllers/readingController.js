const Theme = require('../models/themes');
const Reading = require('../models/readings');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getThemesWithReadings = factory.getOne(Theme, { path: 'readings' });

exports.setThemeAndUserIds = (req, res, next) => {
  req.body.themeId = req.params.themeId;
  req.body.voteCount = 0;
  next();
};

exports.addReadingToTheme = factory.createOne(Reading);

exports.deleteReading = factory.deleteOne(Reading);

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
