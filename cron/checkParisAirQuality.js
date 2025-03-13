const airQualityService = require("../services/airQualityService");
const dotenv = require('dotenv');
const databaseService = require("../services/databaseService");
dotenv.config();
const cron = require('node-cron');


cron.schedule('* * * * *', async () => {
    const parisLatitude = 48.856613;
    const parisLongitude = 2.352222;
    const apiKey = process.env.API_KEY;
    try {
        const airQualityData = await airQualityService.getAirQualityByGIS(parisLatitude, parisLongitude, apiKey);
        const pollutionData = airQualityData.data.current.pollution;

        console.log("airQualityData", airQualityData);
        databaseService.saveAirQualityData(pollutionData,parisLatitude, parisLongitude)
                .then((result) => {
                    console.log("Data saved successfully:", result);

                })
                .catch((error) => {
                    console.log("failed to save data:", error);
                })

    } catch (error) {
        console.error('Error fetching Paris air quality:', error.message);
    }
});