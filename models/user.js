const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'A User must have an email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  username: {
    type: String,
    required: [true, 'A User must have an username.'],
    unique: true,
    trim: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A User must have a password.'],
    minlength: 8,
    trim: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  votedReadings: [
    {
      readingId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      reading: {
        type: String,
        required: true,
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// methods for hashing password
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  // When Mongoose sets the password field for the first time, it considers this a modification, even though it's an initial value.
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  // if the passowrd field hasn't been modified and new document only dont proceed.
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.voteReading = async function (reading) {
  const existingReading = this.votedReadings.find((vr) => {
    return vr.readingId.toString() === reading._id.toString();
  });

  let updateQuery;

  if (existingReading) {
    // If the reading exists, remove it (unvote)
    updateQuery = {
      $pull: { votedReadings: { readingId: reading._id } },
    };
  } else {
    // If the reading does not exist, add it (vote)
    updateQuery = {
      $push: {
        votedReadings: {
          readingId: reading._id,
          reading: reading.reading,
        },
      },
    };
  }

  await this.updateOne(updateQuery, { runValidators: false });

  // Return the updated user document
  return this;
};

// Define a virtual property to get an array of readingIds as strings
userSchema.virtual('votedReadingIds').get(function () {
  return this.votedReadings.map((votedReading) =>
    votedReading.readingId.toString()
  );
});

// Use toJSON method to include virtuals when converting to JSON
userSchema.set('toJSON', { virtuals: true });

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimesstamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimesstamp; // 100 < 200
  }

  // false means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// module.exports = mongoose.model("User", userSchema);
const User = mongoose.model('User', userSchema);

module.exports = User;
