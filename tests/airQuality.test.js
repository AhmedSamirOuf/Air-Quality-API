const express = require('express');
const airQualityController = require('../controllers/airQualityController');
const airQualityService = require('../services/airQualityService');
const databaseService = require('../services/databaseService');

jest.mock('../services/airQualityService');
jest.mock('../services/databaseService');

const app = express();
app.use(express.json());

describe('test air quality controller', () => {
    let latitude;
    let longitude;
    let apiKey;
    let req, res;

    beforeAll(() => {
        latitude = 40.7128;
        longitude = -74.0060;
        apiKey = process.env.API_KEY;
    })
    beforeEach(() => {
        // Mock request and response objects
        req = {
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should return 400 if latitude or longitude is missing', async () => {
        req.query.latitude = latitude;
        await airQualityController.getNearestCityAirQuality(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Latitude, longitude are required.')
    });

    it('should return 500 if there is an error in the service', async () => {
        req.query.latitude = latitude;
        req.query.longitude = longitude;
        airQualityService.getAirQualityByGIS.mockRejectedValue(new Error('Service error'));

        await airQualityController.getNearestCityAirQuality(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal server error.');

    });

    it('should return air quality data if latitude and longitude are provided', async () => {
        const mockAirQualityData = {
            data: {
                current: {
                    pollution: {
                        ts: '2023-10-01T00:00:00.000Z',
                        aqius: 50,
                        mainus: 'p2',
                        aqicn: 25,
                        maincn: 'p2'
                    }
                }
            }
        };
        const ExpectedAirQualityData = {
            Result: {
                Pollution: {
                    ts: '2023-10-01T00:00:00.000Z',
                    aqius: 50,
                    mainus: 'p2',
                    aqicn: 25,
                    maincn: 'p2'
                }
            }
        };

        req.query.latitude = latitude;
        req.query.longitude = longitude;

        airQualityService.getAirQualityByGIS.mockResolvedValue(mockAirQualityData);
        databaseService.saveAirQualityData.mockResolvedValue(mockAirQualityData);

        await airQualityController.getNearestCityAirQuality(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(ExpectedAirQualityData);

    });
});
