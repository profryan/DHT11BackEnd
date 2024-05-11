const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  tempInCelsius: {
    type: Number,
    required: [true, 'Temperature in Celsius is required'],
  },
  humidity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;
