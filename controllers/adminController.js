const Theme = require('../models/themes');
const factory = require('./handlerFactory');

exports.themes = factory.getAll(Theme);

exports.createTheme = factory.createOne(Theme);

exports.updateTheme = factory.updateOne(Theme);

exports.deleteTheme = factory.deleteOne(Theme);

console.log(__dirname);
