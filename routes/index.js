const express = require('express');
const router = express.Router();
const airQualityController = require('../controllers/airQualityController');

router.get('/nearest-city-air-quality', airQualityController.getNearestCityAirQuality);

module.exports = router;