const Theme = require('../models/themes');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const dotenv = require('dotenv');
dotenv.config();

const ITEMS_PER_PAGE = 5;

exports.getAllThemes = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1; // if there is no query parameter the default value will be 1.
  let totalItems;

  const numThemes = await Theme.find().countDocuments(); // Count all documents in the "Product" collection
  totalItems = numThemes; // total number of documents fetched in the database.

  const themes = await Theme.find()
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

exports.getReadings = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;

  const theme = await Theme.findById(themeId);

  if (!theme) {
    return next(new AppError('No tour found with that ID', 404));
  }

  let readings;

  if (theme.readings.length > 0) {
    const historical = theme.readings.filter((reading) => {
      return reading.category == 'Historical';
    });

    const prophetical = theme.readings.filter((reading) => {
      return reading.category == 'Prophetical';
    });

    const epistle = theme.readings.filter((reading) => {
      return reading.category == 'Epistle';
    });

    const gospel = theme.readings.filter((reading) => {
      return reading.category == 'Gospel';
    });

    // create a copy of all the readings
    readings = {
      historical: historical,
      prophetical: prophetical,
      epistle: epistle,
      gospel: gospel,
    };
  } else {
    readings = undefined;
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: readings.length,
    data: {
      readings,
    },
  });
});

exports.checkPasscode = catchAsync(async (req, res, next) => {
  const themeId = req.params.themeId;
  const passcode = req.body.passcode;

  const theme = await Theme.findById(themeId);
  if (!theme) {
    return next(new AppError('No tour found with that ID', 404));
  }

  if (theme.passcode !== passcode) {
    return next(new AppError('Passcode does not matched.', 401));
  }

  // if the themeId is already set in the browser cookies
  // if (cookieThemeId === themeId) {
  //   res.status(202).json({ message: 'passcode did match' });
  // } else {
  //   res.cookie('themeId', themeId, { maxAge: 4 * 60 * 60 * 1000 });
  //   res.status(202).json({ message: 'passcode did match' });
  // }

  res.status(202).json({ message: 'passcode did match', data: theme });
});
