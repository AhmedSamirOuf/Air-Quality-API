const AirQuality = require("../models/airQuality");
const Pollution = require("../models/airQuality");
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
            throw new Error(`Failed to save ${err}`);
        } else {
            console.error('Error saving air quality data:', err);
            err.message = 'Failed to save'
            throw err;
        }
    }

}

const getMaxPollutionDatetime = async (req, res) => {
    try {
        const result = await Pollution.aggregate([
            { $sort: { 'pollution.aqius': -1 } },
            { $limit: 1 },
            { $project: { _id: 0, timestamp: 1 } }
        ]);
        return result.length > 0 ? result[0].timestamp : 0;
    } catch (error) {
        console.error('Error:', error);
        throw error
    }
}

module.exports = {
    saveAirQualityData,
    getMaxPollutionDatetime
};
