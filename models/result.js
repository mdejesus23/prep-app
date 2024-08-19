const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Preparation result must have theme title.'],
  },
  entranceSong: {
    type: String,
    required: [true, 'Preparation result must have entrance song.'],
  },
  firstReading: {
    type: String,
    required: [true, 'Preparation result must have first reading.'],
  },
  firstPsalm: {
    type: String,
    required: [true, 'Preparation result must have first psalm.'],
  },
  secondReading: {
    type: String,
    required: [true, 'Preparation result must have second reading.'],
  },
  secondPsalm: {
    type: String,
    required: [true, 'Preparation result must have second psalm.'],
  },
  thirdReading: {
    type: String,
    required: [true, 'Preparation result must have third reading.'],
  },
  thirdPsalm: {
    type: String,
    required: [true, 'Preparation result must have third psalm.'],
  },
  gospel: {
    type: String,
    required: [true, 'Preparation result must have gospel.'],
  },
  finalSong: {
    type: String,
    required: [true, 'Preparation result must have final.'],
  },
  createdAt: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
  // Parent referencing. One to many - One User to Many result.
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Result', resultSchema);
