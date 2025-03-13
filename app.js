const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api', routes);

connectDB()

module.exports = app;