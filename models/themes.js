const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const themeSchema = new Schema({
  title: {
    type: String,
    required: [true, 'A Theme must have a title.'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A Theme must have a description.'],
  },
  passcode: {
    type: String,
    required: [true, 'A Theme must have a passcode.'],
    trim: true,
    maxLength: [
      10,
      'A theme passcode must have less or equal than 10 characters.',
    ],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String,
});

themeSchema.index({ title: 1 });

// Virtual populate to avoid array child referencing.
themeSchema.virtual('readings', {
  ref: 'Reading',
  foreignField: 'themeId',
  localField: '_id',
});

themeSchema.set('toJSON', { virtuals: true });
themeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Theme', themeSchema);
