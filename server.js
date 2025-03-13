const app = require('./app');
const {connection} = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
require('./cron/checkParisAirQuality');


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await connection.close();
    server.close(() => {
        console.log('Server and MongoDB connection closed.');
        process.exit(0);
    });
});