import express from "express";

import {
  postWalkSetup,
  insertPost,
  fetchDataForPostPage,
  fetchDataForOwnerProfilePage,
  fetchDataByTag,
  fetchAllPostData,
  updatePostContent,
  deletePost,
  deleteTag,
  insertTag,
} from "../services/postWalkService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("hello there");
});

router.get("/all/:condition", async (req, res) => {
  try {
    const cond = req.params.condition;
    const tableContent = await fetchAllPostData(cond);
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

router.post("/initiate-posts", async (req, res) => {
  const initiateResult = await postWalkSetup();
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-post", async (req, res) => {
  const { walkID, ownerID, content, tags } = req.body;
  const postID = await insertPost(walkID, ownerID, content, tags);
  console.log(postID);
  if (postID) {
    res.json({ success: true, postID: postID });
  } else {
    res.status(500).json({ success: false, postID: postID });
  }
});

// function to get all the post based on a tag.
router.get("/:tag/fetch-by-tag", async (req, res) => {
  try {
    const tag = req.params.tag;
    const tableContent = await fetchDataByTag(tag);
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

// for fetching ALL posts made by a single owner
router.get("/:ownerID/fetch-by-owner", async (req, res) => {
  try {
    const ownerID = req.params.ownerID;
    const tableContent = await fetchDataForOwnerProfilePage(ownerID);
    if (!tableContent) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving owner posts:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

// function to get all the data necessary for post page.
router.get("/:ownerID/:postID", async (req, res) => {
  try {
    const postID = req.params.postID;
    const ownerID = req.params.ownerID;
    const tableContent = await fetchDataForPostPage(postID, ownerID);
    if (!tableContent) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving post:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

router.put("/:postid/update-post-content", async (req, res) => {
  const { content } = req.body;
  const postid = req.params.postid;
  const updateResult = await updatePostContent(postid, content);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/:postid/delete-post", async (req, res) => {
  const postid = req.params.postid;
  console.log(postid);
  const deleteResult = await deletePost(postid);
  if (deleteResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/:postid/:tag/delete-tag", async (req, res) => {
  const postid = req.params.postid;
  const tag = req.params.tag;
  const result = await deleteTag(postid, tag);

  if (result) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/:postid/insert-tag", async (req, res) => {
  const postid = req.params.postid;
  const { tag } = req.body;
  const insertResult = await insertTag(postid, tag);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
