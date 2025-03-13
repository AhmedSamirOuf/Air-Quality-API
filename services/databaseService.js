const AirQuality = require("../models/airQuality");

const saveAirQualityData = async (pollutionData, latitude, longitude) => {
    const savedData = {
        latitude: latitude,
        longitude: longitude,
        pollution: {
            ts: pollutionData.ts,
            aqius: pollutionData.aqius,
            mainus: pollutionData.mainus,
            aqicn: pollutionData.aqicn,
            maincn: pollutionData.maincn
        }
    };
    try {
        const newAirQualityData = new AirQuality(savedData);
        const savedDataResult = await newAirQualityData.save();
        console.log('Air quality data saved to the database:', savedDataResult);
        return savedDataResult;
    }catch(err) {
        if (err.name === 'ValidationError') {
            console.error('Validation error saving air quality data:', err.message);
            throw new Error(`Validation error: ${err}`);
        } else {
            console.error('Error saving air quality data:', err);
            throw err;
        }
    }

}
module.exports = {
    saveAirQualityData
};
