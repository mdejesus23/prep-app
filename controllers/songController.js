const Song = require('../models/song');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const optimizeCloudinaryUrl = (url) => {
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
};

// All user has access to preparation themes.
const allUserHasAccess = true;

exports.songs = factory.getAll(Song, allUserHasAccess);

exports.getSong = catchAsync(async (req, res, next) => {
  const songId = req.params.songId;

  const song = await Song.findById(songId);

  if (!song) {
    return next(new AppError('No theme found with that ID.', 404));
  }

  const updatedSongs = {
    ...song.toObject(),
    imageUrl: optimizeCloudinaryUrl(song.imageUrl),
  };

  res.status(200).json({
    status: 'success',
    data: updatedSongs,
  });
});
