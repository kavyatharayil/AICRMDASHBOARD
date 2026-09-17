import dns from "node:dns";
import mongoose from "mongoose";

// Set DNS to Google's public servers to resolve SRV records properly
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const FALLBACK_LOCAL_URI = "mongodb://127.0.0.1:27017/aicrmdashboard";

export const connectDB = async () => {
  const candidateUris = [process.env.MONGO_URI, FALLBACK_LOCAL_URI].filter(Boolean);

  mongoose.set("strictQuery", true);

  for (const uri of candidateUris) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });

      console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.warn(`MongoDB connection failed for ${uri}:`, error.message);
    }
  }

  console.warn("All MongoDB connection attempts failed; continuing without database access.");
  return null;
};