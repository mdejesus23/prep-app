const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const themeSchema = new Schema({
  title: {
    type: String,
    required: [true, 'A Theme must have a title.'],
    unique: true,
    trim: true,
  },
  imageName: {
    type: String,
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
  // Parent referencing. One to many - One User to Many themes.
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String,
});

module.exports = mongoose.model('Theme', themeSchema);
