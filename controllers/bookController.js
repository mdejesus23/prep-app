const Book = require('../models/book');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getBook = catchAsync(async (req, res, next) => {
  const bookId = req.params.bookId;
  const book = await Book.findById(bookId);

  if (!book) {
    return next(new AppError('No book found in the database', 404));
  }

  res.status(200).json({
    status: 'success',
    data: book,
  });
});
