const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const liturgyOfHoursSchema = new Schema({
  season: {
    type: String,
    required: [true, 'A liturgy entry must have a season.'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'A liturgy entry must have a title.'],
    trim: true,
  },
  slug: String,
  week: {
    type: String,
    trim: true,
  },
  day: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    required: true,
  },
  htmlContent: {
    type: String,
    required: [true, 'A liturgy entry must have content.'],
  },
  sourceFiles: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

liturgyOfHoursSchema.index({ season: 1 });
liturgyOfHoursSchema.index({ season: 1, week: 1 });
liturgyOfHoursSchema.index({ order: 1 });

liturgyOfHoursSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('LiturgyOfHours', liturgyOfHoursSchema);
