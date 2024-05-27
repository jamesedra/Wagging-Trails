import express from "express";
import { fetchAllFriendPosts } from "../services/friendPostsService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tableContent = await fetchAllFriendPosts();
  res.json({ data: tableContent });
});

export default router;