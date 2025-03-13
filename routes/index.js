const express = require('express');
const router = express.Router();
const airQualityController = require('../controllers/airQualityController');

router.get('/air-quality', airQualityController.getNearestCityAirQuality);
router.get('/most-polluted-time', airQualityController.maxPollutionDatetime);

module.exports = router;