const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema({
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    pollution: {
        ts: { type: Date, required: true },
        aqius: { type: Number, required: true },
        mainus: { type: String, required: true },
        aqicn: { type: Number, required: true },
        maincn: { type: String, required: true },
    },
    timestamp: { type: Date, default: Date.now },
});

const AirQuality = mongoose.model('AirQuality', airQualitySchema);

module.exports = AirQuality;