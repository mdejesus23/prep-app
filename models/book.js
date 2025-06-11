const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, 'A song must have a title.'],
    unique: true,
    trim: true,
  },
  slug: String,
  description: String,
  epubUrl: String,
  createdAt: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
});

bookSchema.index({ title: 1 });
bookSchema.index({ description: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
bookSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Book', bookSchema);
