import express from "express";
import {
  upload,
  insertMedia,
  deleteMedia,
} from "../services/postMediaService.js";
const router = express.Router();

router.post("/upload", upload.array("files", 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }
    const postID = req.body.postID;
    console.log(postID);
    if (!postID) {
      return res
        .status(400)
        .json({ success: false, message: "postID is required." });
    }
    const files = req.files;
    const insertPromises = [];

    for (const file of files) {
      const fileName = file.filename;
      const date = new Date().toISOString().split("T")[0];
      const mediaType = file.mimetype.startsWith("image/") ? "image" : "video";
      insertPromises.push(insertMedia(fileName, date, mediaType, postID));
    }

    const results = await Promise.all(insertPromises);
    const success = results.every((result) => result);

    if (success) {
      res.status(200).json({
        success: true,
        message: "Files uploaded and saved successfully.",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to save media." });
    }
  } catch (error) {
    console.error("Error:", error);
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.post("/insert", async (req, res) => {
  const { fileName, date, mediaType, postID } = req.body;
  console.log("here");
  const insertResult = await insertMedia(fileName, date, mediaType, postID);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, postID: postID });
  }
});

router.delete("/:url/delete-media", async (req, res) => {
  const url = req.params.url;
  const deleteResult = await deleteMedia(url);
  if (deleteResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
