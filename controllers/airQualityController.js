const airQualityService = require('../services/airQualityService');
const databaseService = require('../services/databaseService');

const dotenv = require('dotenv');
dotenv.config();

const getNearestCityAirQuality = async (req, res) => {
    const apiKey = process.env.API_KEY;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    if (!latitude || !longitude) {
        return res.status(400).send('Latitude, longitude are required.');
    }

    try {
        const airQualityData = await airQualityService.getAirQualityByGIS(latitude, longitude, apiKey);
        const pollutionData = airQualityData.data.current.pollution;
        let formattedResponse;
        databaseService.saveAirQualityData(pollutionData,latitude, longitude)
            .then((result) => {
                console.log("Data saved successfully:", result);
                formattedResponse = {
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
            })
            .catch((error) => {
                console.error("failed to save data:", error);
                formattedResponse = {
                    Result: {
                        "message": `Failed to save data: ${error}`,
                    }
                }
                res.status(400).send(formattedResponse);
            })
    } catch (error) {
        console.error('Error in getNearestCityAirQuality:', error);
        res.status(500).send('Internal server error.');
    }
};

module.exports = {
    getNearestCityAirQuality
};