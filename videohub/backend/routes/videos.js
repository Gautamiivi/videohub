import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Video from "../models/Video.js";

const router = express.Router();

/* Needed for ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* UPLOAD VIDEO */
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const video = await Video.create({
      title: req.body.title || "Untitled Video",
      filename: req.file.filename, 
      videoUrl: `http://localhost:5001/uploads/${req.file.filename}`,
    });

    res.status(201).json(video);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

/* GET ALL VIDEOS  */
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

/* ---------------- DELETE VIDEO (FIXED) ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // FILENAME
    let filename = video.filename;

    // fallback for old videos
    if (!filename && video.videoUrl) {
      filename = video.videoUrl.split("/uploads/")[1];
    }

    // FILE DELETE
    if (filename) {
      const filePath = path.join(__dirname, "../uploads", filename);

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("FILE DELETE ERROR:", err);
        });
      }
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
