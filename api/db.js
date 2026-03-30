import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// ✅ Global cache (important for serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // ✅ If already connected and ready, reuse it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // ✅ Create connection if not already started
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    // Wait for connection promise
    cached.conn = await cached.promise;

    // ✅ EXTRA SAFETY: ensure connection is fully ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once("connected", resolve);
      });
    }

  } catch (error) {
    // Reset promise if failed
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
