const Result = require('../models/result');

const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.preparationResults = factory.getAll(Result);

exports.addpreparationResult = factory.createOne(Result);

exports.deleteResult = factory.deleteOne(Result);

exports.updateResult = factory.updateOne(Result);
