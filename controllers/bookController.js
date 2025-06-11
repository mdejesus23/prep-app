const Book = require('../models/book');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findOne(); // Fetches the first (and only) document

  if (!book) {
    return next(new AppError('No book found in the database', 404));
  }

  res.status(200).json({
    status: 'success',
    data: book,
  });
});
