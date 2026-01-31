import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";

/* =========================
   Load environment variables
========================= */
dotenv.config();

const app = express();

/* =========================
   ES module dirname fix
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   CORS Configuration
========================= */
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",      // local frontend
      "http://localhost:3000",      // alternative local port
      "https://videohub-frontend.vercel.app",  // Vercel frontend (example)
      process.env.FRONTEND_URL      // deployed frontend from env
    ].filter(Boolean);

    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(null, true); // Allow for now, log for debugging
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   MongoDB Connection
========================= */
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in environment variables");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // Don't exit - let the server continue running
  }
};

connectDB();

/* =========================
   Static uploads
========================= */
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

/* =========================
   Routes
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

/* =========================
   Health check (REQUIRED for Render)
========================= */
app.get("/health", (req, res) => {
  const mongoState = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "OK",
    message: "Backend is healthy 🚀",
    mongodb: mongoState,
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   Root route
========================= */
app.get("/", (req, res) => {
  res.send("VideoHub Backend is running 🚀");
});

/* =========================
   Error handling middleware
========================= */
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

/* =========================
   Server
========================= */
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`   MongoDB: ${mongoose.connection.readyState === 1 ? "Connected" : "Not connected"}`);
});
