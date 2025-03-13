const airQualityService = require('../services/airQualityService');
const databaseService = require('../services/databaseService');

const dotenv = require('dotenv');
dotenv.config();

/**
 * @swagger
 *  * /air-quality:
 *  *   get:
 *  *     summary: Get air quality information for a given location
 *  *     description: Fetch air quality data based on latitude and longitude.
 *  *     parameters:
 *  *       - in: query
 *  *         name: latitude
 *  *         required: true
 *  *         schema:
 *  *           type: number
 *  *         description: Latitude of the location
 *  *       - in: query
 *  *         name: longitude
 *  *         required: true
 *  *         schema:
 *  *           type: number
 *  *         description: Longitude of the location
 *  *     responses:
 *  *       200:
 *  *         description: Air quality data retrieved successfully
 *  *         content:
 *  *           application/json:
 *  *             schema:
 *  *               type: object
 *  *               properties:
 *  *                 ts:
 *  *                   type: string
 *  *                   format: date-time
 *  *                   example: "2025-03-13T20:00:00.000Z"
 *  *                 aqius:
 *  *                   type: number
 *  *                   example: 36
 *  *                 mainus:
 *  *                   type: string
 *  *                   example: "p2"
 *  *                 aqicn:
 *  *                   type: number
 *  *                   example: 20
 *  *                 maincn:
 *  *                   type: string
 *  *                   example: "o3"
 *  *       500:
 *  *         description: Failed to fetch air quality data
 *  */
const getNearestCityAirQuality = async (req, res) => {
    const apiKey = process.env.API_KEY;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    if (!apiKey) {
        throw new Error("API_KEY is not defined in environment variables.");
    }
    if (!latitude || !longitude) {
        return res.status(400).send('Latitude, longitude are required.');
    }
    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: 'Latitude and longitude must be numbers.' });
    }

    try {
        const airQualityData = await airQualityService.getAirQualityByGIS(latitude, longitude, apiKey);
        const pollutionData = airQualityData.data.current.pollution;
        await databaseService.saveAirQualityData(pollutionData, latitude, longitude);
        const formattedResponse = {
            Result: {
                Pollution: {
                    ts: pollutionData.ts,
                    aqius: pollutionData.aqius,
                    mainus: pollutionData.mainus,
                    aqicn: pollutionData.aqicn,
                    maincn: pollutionData.maincn,
                },
            },
        };
        res.status(200).json(formattedResponse);

    } catch (error) {
        console.error('Error in getNearestCityAirQuality:', error);
        if (error.message === "API_KEY is not defined in environment variables."){
            res.status(500).json({ message: 'Internal server error: API Key Missing' });
        }
        else if (error.message.startsWith('Failed to fetch')) {
            res.status(500).json({ message: 'Failed to fetch air quality data from the external service.' });
        } else if (error.message.startsWith('Failed to save')) {
            res.status(500).json({ message: 'Failed to save air quality data to the database.' });
        } else {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
};
/**
 * @swagger
 *  * /air-quality:
 *  *   get:
 *  *     summary: Get most polluted time
 *  *     description: Get Most polluted time based on the data on our database
 *  *     responses:
 *  *       200:
 *  *         description: Air quality data retrieved successfully
 *  *         content:
 *  *           application/json:
 *  *             schema:
 *  *               type: object
 *  *               properties:
 *  *                 result:
 *  *                   type: string
 *  *                   format: date-time
 *  *                   example: "2025-03-13T20:00:00.000Z"
 *  *       400:
 *  *         description: error in getting max pollution
 *  *       404:
 *  *         description: no pollution date found
 *  */
const maxPollutionDatetime = async (req, res) => {
    try {
        const timestamp = await databaseService.getMaxPollutionDatetime()
        if(!timestamp) {
            return res.status(404).json({ message: 'No pollution data found.' });
        }
        return res.status(200).json({timestamp})
    } catch (error) {
        console.error('Error:', error);
        res.status(400).send(`Couldn't get max pollution date time: ${error}`);
    }
}

module.exports = {
    getNearestCityAirQuality,
    maxPollutionDatetime
};