const Reading = require('../models/readings');
const Theme = require('../models/themes');
const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({
      _id: req.params.themeId || req.params.readingId || req.params.resultId,
      userId: req.user.id,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // Delete all associated readings if the document is a Theme
    if (Model === Theme) {
      await Reading.deleteMany({ themeId: req.params.themeId });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndUpdate(
      {
        _id: req.params.themeId || req.params.readingId || req.params.resultId,
        userId: req.user.id,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create({ ...req.body, userId: req.user.id });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query;
    if (Model === User) {
      query = Model.findById(req.user.id);
    } else {
      query = Model.findOne({
        _id: req.params.themeId || req.params.readingId || req.params.resultId,
        userId: req.user.id,
      });
    }

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, allUserHasAccess = false) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    if (!allUserHasAccess) {
      filter = { userId: req.user.id };
    } else {
      filter = {};
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .sort()
      .paginate();

    const doc = await features.query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
