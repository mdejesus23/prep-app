const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// first object for schema definition, second object for option.
const themeSchema = new Schema(
  {
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
    createdAt: {
      type: Date,
      default: Date.now, // This sets the default value to the current date and time
    },
    imageUrl: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create an ascending index on the 'title' field
themeSchema.index({ title: 1 });

// Virtual populate to avoid array child referencing.
themeSchema.virtual('readings', {
  ref: 'Reading',
  foreignField: 'themeId',
  localField: '_id',
});

module.exports = mongoose.model('Theme', themeSchema);
