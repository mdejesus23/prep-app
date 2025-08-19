const axios = require('axios');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getLiturgicalCalendar = catchAsync(async (req, res, next) => {
  const { year, month, day } = req.params;
  const response = await axios.get(
    `http://calapi.inadiutorium.cz/api/v0/en/calendars/default/${year}/${month}/${day}`
  );

  // If response doesn't have expected data
  if (!response.data) {
    return next(new AppError('No data returned from third-party API', 404));
  }

  res.status(200).json({
    status: 'success',
    data: response.data,
  });
});
