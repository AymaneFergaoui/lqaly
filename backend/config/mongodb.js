import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectdb = async () => {
  try {
    if (cached.conn) {
      if (process.env.NODE_ENV === 'production') console.log('Using cached MongoDB connection');
      return cached.conn;
    }
    
    if (mongoose.connection.readyState >= 1) {
      if (process.env.NODE_ENV === 'production') console.log('MongoDB already connected (readyState).');
      return mongoose.connection;
    }

    // Check if MongoDB URI is provided
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // Increased timeout for better stability
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      }).then((mongoose) => {
        return mongoose;
      });
    }
    
    cached.conn = await cached.promise;
    const conn = cached.conn;

    if (process.env.NODE_ENV === 'production') console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown (removed process.exit to let main process handle it)
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
      } catch (closeErr) {
        console.error('Error closing MongoDB connection:', closeErr);
      }
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Clear the promise so the next request can retry connecting
    cached.promise = null;
    
    // Always throw the error in serverless environments to prevent requests from hanging
    throw error;
  }
};

export default connectdb;