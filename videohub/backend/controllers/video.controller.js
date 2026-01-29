const Video = require("../models/Video");

exports.upload = async (req, res) => {
  const video = await Video.create({
    title: req.body.title,
    filename: req.file.filename,
    user: req.user.id
  });
  res.json(video);
};

exports.getAll = async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
};
