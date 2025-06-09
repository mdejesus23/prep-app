const Song = require('../models/song');
const factory = require('./handlerFactory');

// All user has access to preparation themes.
const allUserHasAccess = true;

exports.songs = factory.getAll(Song, allUserHasAccess);
