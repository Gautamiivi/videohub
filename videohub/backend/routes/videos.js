import express from "express";
import Video from "../models/Video.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* GET ALL VIDEOS */
router.get("/", auth, async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

export default router;
