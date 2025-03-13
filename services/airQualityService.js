const axios = require('axios');

const getAirQualityByGIS = async (latitude, longitude, apiKey) => {
    try {
        const response = await axios.get(
            `https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${apiKey}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching air quality:', error);
        error.message = "Failed to fetch"
        throw error;
    }
}

module.exports = {
    getAirQualityByGIS
};