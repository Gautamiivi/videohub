import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";

/* Load environment variables */
dotenv.config();

const app = express();

/* ES module dirname fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   Middleware
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // local dev
      process.env.FRONTEND_URL              // production (Vercel)
    ],
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
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
   Health Check (IMPORTANT)
========================= */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is healthy 🚀" });
});

/* =========================
   Server
========================= */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
