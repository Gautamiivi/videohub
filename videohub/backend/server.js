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
   Middleware
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",      // local frontend
        process.env.FRONTEND_URL      // deployed frontend (Vercel)
      ];

      // allow server-to-server & tools like Postman
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // IMPORTANT: do NOT exit process on Render
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
   Health check (REQUIRED)
========================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is healthy 🚀",
  });
});

/* =========================
   Root route (optional)
========================= */
app.get("/", (req, res) => {
  res.send("VideoHub Backend is running 🚀");
});

/* =========================
   Server
========================= */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
