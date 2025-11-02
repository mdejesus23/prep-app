const axios = require('axios');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getBibleReading = catchAsync(async (req, res, next) => {
  const verse = req.params.verse;
  const response = await axios.get(`https://bible-api.com/${verse}`);

  // If response doesn't have expected data
  if (!response.data) {
    return next(new AppError('No data returned from third-party API', 404));
  }

  res.status(200).json({
    status: 'success',
    data: response.data,
  });
});
