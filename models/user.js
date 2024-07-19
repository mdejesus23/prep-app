const mongoose = require('mongoose');

// const Theme = require("./themes");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'A User must have an email.'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'A User must have a password.'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'A User must have an username.'],
    unique: true,
    trim: true,
  },
  resetToken: String,
  resetTokenExpiration: String,
  votedReadings: [
    {
      readingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      reading: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.voteReading = function (reading) {
  const updatedVotedReading = [...this.votedReadings];

  const existingReading = this.votedReadings.find((vr) => {
    return vr.readingId.toString() === reading._id.toString();
  });

  if (existingReading) {
    const filterReadings = updatedVotedReading.filter((vr) => {
      return vr.readingId.toString() !== reading._id.toString();
    });

    this.votedReadings = filterReadings;
    return this.save();
  }

  updatedVotedReading.push({
    readingId: reading._id,
    reading: reading.reading,
  });

  this.votedReadings = updatedVotedReading;
  return this.save();
};

// Define a virtual property to get an array of readingIds as strings
userSchema.virtual('votedReadingIds').get(function () {
  return this.votedReadings.map((votedReading) =>
    votedReading.readingId.toString()
  );
});

// Use toJSON method to include virtuals when converting to JSON
userSchema.set('toJSON', { virtuals: true });

// module.exports = mongoose.model("User", userSchema);
const User = mongoose.model('User', userSchema);

module.exports = User;
