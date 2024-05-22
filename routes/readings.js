const express = require('express');
const router = express.Router();
const Reading = require('../models/Reading');

//all reading
router.get('/', async (req, res) => {
  try {
    const readings = await Reading.find();
    res.json({ success: true, data: readings }); //eto yung orig na content
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

//Get the latest reading
router.get('/latest', async (req, res) => {
  try {
    const latestReading = await Reading.findOne().sort({ date: -1 });
    if (!latestReading) {
      return res.status(404).json({ success: false, error: 'No data found' });
    }
    res.json({ success: true, data: latestReading });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

//get a single reading
router.get('/:id', async (req, res) => {
  try {
    const reading = await Reading.findById(req.params.id);
    res.json({ success: true, data: reading });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

//Add temperature reading
router.post('/', async (req, res) => {
  const reading = new Reading({
    tempInCelsius: req.body.tempInCelsius, // Corrected property name
    humidity: req.body.humidity,
  });

  try {
    const savedReading = await reading.save();
    res.json({ success: true, data: savedReading });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;
