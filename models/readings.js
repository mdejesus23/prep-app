const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readingsSchema = new Schema({
  reading: {
    type: String,
    required: [true, 'A Reading must have a chapter and verse.'],
  },
  category: {
    type: String,
    required: [true, 'A Reading must have a category.'],
  },
  voteCount: Number,
  // Parent referencing. One to many - One Theme to Many readings.
  themeId: {
    type: Schema.Types.ObjectId,
    ref: 'Theme',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Reading', readingsSchema);
