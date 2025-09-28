const mongoose = require('mongoose');

// MongoDB configuration
const connectDB = async () => {
  try {
    // MongoDB connection URI - will be provided by user
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/socialx';
    
    const options = {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Graceful close on app termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    
    // If MongoDB connection fails, you can optionally fall back to mock database
    console.log('Falling back to mock database...');
    return null;
  }
};

module.exports = connectDB;