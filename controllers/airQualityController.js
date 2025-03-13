const airQualityService = require('../services/airQualityService');

const getNearestCityAirQuality = async (req, res)=> {
    const apiKey = process.env.API_KEY;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    if (!latitude || !longitude) {
        return res.status(400).send('Latitude, longitude are required.');
    }

    try {
        const airQualityData = await airQualityService.getAirQualityByGIS(latitude, longitude, apiKey);
        const pollutionData = airQualityData.data.current.pollution;
        const formattedResponse = {
            Result: {
                Pollution: {
                    ts: pollutionData.ts,
                    aqius: pollutionData.aqius,
                    mainus: pollutionData.mainus,
                    aqicn: pollutionData.aqicn,
                    maincn: pollutionData.maincn
                }
            }
        };
        res.json(formattedResponse);
    } catch (error) {
        res.status(500).send('Internal server error.');
    }
}

module.exports = {
    getNearestCityAirQuality
};