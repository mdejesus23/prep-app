const Result = require('../models/result');

const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.preparationResults = catchAsync(async (req, res, next) => {
  const prepResults = await Result.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      prepResults,
    },
  });
});

exports.addpreparationResult = factory.createOne(Result);

exports.deleteResult = factory.deleteOne(Result);

exports.updateResult = factory.updateOne(Result);
