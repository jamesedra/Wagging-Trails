import express from "express";
import {
  insertTaggedDog,
  deleteTaggedIn,
  findAllTags,
} from "../services/taggedInService.js";

const router = express.Router();

// inserts a list of dogs who participated in a walk.
router.post("/insert-tagged-in", async (req, res) => {
  const { dogIDs, postID } = req.body;
  const insertResult = await insertTaggedDog(dogIDs, postID);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/:postid/delete-tagged-in", async (req, res) => {
  const postID = req.params.postid;
  const insertResult = await deleteTaggedIn(postID);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/posts-with-tags", async (req, res) => {
  try {
    const { tags } = req.body;
    const tableContent = await findAllTags(tags);

    if (!tableContent) {
      res.status(404).json({ error: "Posts not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving posts:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

export default router;
