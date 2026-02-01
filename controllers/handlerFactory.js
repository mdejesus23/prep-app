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
    // Step 1: Find the document by ID and userId
    const doc = await Model.findOne({
      _id: req.params.themeId || req.params.readingId || req.params.resultId,
      userId: req.user.id,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // Step 2: Update the document properties manually
    Object.keys(req.body).forEach((key) => {
      doc[key] = req.body[key];
    });

    // Step 3: Save the document to trigger the pre-save middleware
    await doc.save();

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

    // Build the query filter from query params (same logic as APIFeatures.filter)
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const queryFilter = JSON.parse(queryStr);

    // Add search condition if present
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      queryFilter.$or = [
        { title: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    // Combine base filter with query filter
    const countFilter = { ...filter, ...queryFilter };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;

    const totalDocuments = await Model.countDocuments(countFilter);
    const totalPages = Math.ceil(totalDocuments / limit);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

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
