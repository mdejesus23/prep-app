const User = require('./../models/user');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const { cloudinary } = require('../utils/cloudinary');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  // loop through object keys, return an arrays of object keys.
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) update user document.
  const filteredBody = filterObj(req.body, 'username', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // 2) SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = factory.getOne(User);

exports.resetUserVotes = catchAsync(async (req, res, next) => {
  let user;
  // 1) Find the user by ID
  user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // 2) Reset the user's votes using the schema method
  await user.resetVotes();

  // 3) SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Middleware to handle file upload
exports.upload = upload.single('image');

exports.uploadProfileImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No image file uploaded.', 400));
  }

  const { path: imageUrl, filename: imageId } = req.file;

  const user = await User.findById(req.user._id);

  if (!user) return next(new AppError('User not found', 404));

  // 1) Delete old image if it exists
  if (user.cloudinaryId) {
    try {
      await cloudinary.uploader.destroy(user.cloudinaryId);
    } catch (err) {
      return next(new AppError('Failed to delete old profile image.', 500));
    }
  }
  // 3) Update the user with the new profile image
  user.photo = imageUrl; // Ensure your User model has a `photo` field
  user.cloudinaryId = imageId; // Optional if you want to allow deletion later
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
