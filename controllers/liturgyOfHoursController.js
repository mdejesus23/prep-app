const LiturgyOfHours = require('../models/liturgyOfHours');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const allUserHasAccess = true;

exports.getAllLiturgyOfHours = factory.getAll(LiturgyOfHours, allUserHasAccess);

exports.getLiturgyByWeekAndSeason = catchAsync(async (req, res, next) => {
  const { week, season } = req.query;

  const filter = {};
  if (week) filter.week = week;
  if (season) filter.season = { $regex: season, $options: 'i' };

  const features = new APIFeatures(LiturgyOfHours.find(filter), req.query)
    .sort()
    .limitFields()
    .paginate();

  const doc = await features.query;

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const totalDocuments = await LiturgyOfHours.countDocuments(filter);
  const totalPages = Math.ceil(totalDocuments / limit);

  res.status(200).json({
    status: 'success',
    results: doc.length,
    currentPage: page,
    limit,
    totalPages,
    totalDocuments,
    data: doc,
  });
});

exports.getLiturgyOfHours = catchAsync(async (req, res, next) => {
  const doc = await LiturgyOfHours.findById(req.params.id);

  if (!doc) {
    return next(new AppError('No liturgy entry found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});
