const { maxPollutionDatetime } = require('../../controllers/airQualityController'); // Adjust the path
const Pollution = require('../../models/airQuality'); // Adjust the path

describe('getMaxPollutionDatetime', () => {
    let mockAggregate;
    let req, res;

    beforeEach(() => {
        mockAggregate = jest.spyOn(Pollution, 'aggregate');
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
        mockAggregate.mockRestore();
    });

    it('should return the timestamp of the document with the maximum aqius', async () => {
        const mockTimestamp = new Date('2025-03-13T13:52:41.556Z');
        // Mock the aggregate function to return an array with one document
        mockAggregate.mockResolvedValue([{ timestamp: mockTimestamp }]);

        await maxPollutionDatetime(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({timestamp:mockTimestamp});
        expect(mockAggregate).toHaveBeenCalledWith([
            { $sort: { 'pollution.aqius': -1 } },
            { $limit: 1 },
            { $project: { _id: 0, timestamp: 1 } }
        ]);
    });

    it('should return 0 if no documents are found', async () => {
        // Mock the aggregate function to return an empty array
        mockAggregate.mockResolvedValue([]);

        await maxPollutionDatetime(req,res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(mockAggregate).toHaveBeenCalledWith([
            { $sort: { 'pollution.aqius': -1 } },
            { $limit: 1 },
            { $project: { _id: 0, timestamp: 1 } }
        ]);
    });

    it('should return 0 if an error occurs', async () => {
        // Mock the aggregate function to throw an error
        mockAggregate.mockRejectedValue(new Error('Database error'));

        await maxPollutionDatetime(req,res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});