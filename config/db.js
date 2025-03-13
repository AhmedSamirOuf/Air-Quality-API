const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('MongoDB connection');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const connectDB = async()=>  {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to MongoDB using Mongoose!');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the process if the connection fails
    }
}

module.exports = connectDB;