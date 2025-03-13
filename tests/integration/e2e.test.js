
const request = require('supertest');
const app = require('../../app'); // Assuming your main app file is app.js
const mongoose = require('mongoose');
const AirQuality = require('../../models/airQuality'); // Assuming your MongoDB model is in models/airQuality.js

describe('Air Quality API Integration Tests (MongoDB)', () => {
    beforeAll(async () => {
        await mongoose.disconnect()
        const MONGODB_URI_TEST =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/testing_database?retryWrites=true&w=majority`;

        await mongoose.connect(MONGODB_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await AirQuality.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should get air quality by coordinates', async () => {
        const response = await request(app)
            .get('/api/air-quality')
            .query({ latitude: 40.7128, longitude: -74.0060 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('Result');
        expect(response.body.Result).toHaveProperty('Pollution');
        expect(Object.keys(response.body.Result.Pollution).length).toEqual(5);
    });

    it('should return 400 if latitude or longitude is missing', async () => {
        const response = await request(app).get('/api/air-quality').query({ latitude: 40.7128 });
        expect(response.status).toBe(400);

        const response2 = await request(app).get('/api/air-quality').query({ longitude: -74.0060 });
        expect(response2.status).toBe(400);
    });

    it('should get most polluted time (after cron job runs)', async () => {
        // Wait for a bit to let the cron job run at least once (adjust time as needed)
        await new Promise(resolve => setTimeout(resolve, 65000));

        const response = await request(app).get('/api/most-polluted-time');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('timestamp');
    }, 70000);
});