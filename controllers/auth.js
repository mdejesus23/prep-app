const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.createUser = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      username: username,
      password: hashedPassword,
      votedReadings: [],
    });
    await user.save();

    res.status(201).json({
      message: 'created user successfully!',
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
