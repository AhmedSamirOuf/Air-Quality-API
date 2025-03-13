const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const connectDB = require('./config/db');
const swaggerDocs = require('./swagger');

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api', routes);
swaggerDocs(app);

connectDB()

module.exports = app;