const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  entranceSong: {
    type: String,
    required: true,
  },
  firstReading: {
    type: String,
    required: true,
  },
  firstPsalm: {
    type: String,
    required: true,
  },
  secondReading: {
    type: String,
    required: true,
  },
  secondPsalm: {
    type: String,
    required: true,
  },
  thirdReading: {
    type: String,
    required: true,
  },
  thirdPsalm: {
    type: String,
    required: true,
  },
  gospel: {
    type: String,
    required: true,
  },
  finalSong: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
});

module.exports = mongoose.model("Result", resultSchema);
