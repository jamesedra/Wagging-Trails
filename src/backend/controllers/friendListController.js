import express from "express";
import {
  fetchFriendListFromDB,
  initiateOwners,
  insertFriendship,
  deleteFriendship,
  fetchFriendsForProfilePage,
} from "../services/friendListService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tableContent = await fetchFriendListFromDB();
  res.json({ data: tableContent });
});

router.post("/initiate-owners", async (req, res) => {
  const initiateResult = await initiateOwners();
  console.log("a");
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-friendship", async (req, res) => {
  const { ownerid1, ownerid2, dateoffriendship } = req.body;
  const insertResult = await insertFriendship(
    ownerid1,
    ownerid2,
    dateoffriendship
  );
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/delete-friendship", async (req, res) => {
  const { ownerid1, ownerid2 } = req.body;
  const deleteResult = await deleteFriendship(ownerid1, ownerid2);
  if (deleteResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

// function to get all the data necessary for profile page.
router.get("/:ownerID/fetch-friendship", async (req, res) => {
  try {
    const ownerID = req.params.ownerID;
    const tableContent = await fetchFriendsForProfilePage(ownerID);
    if (!tableContent) {
      res.status(404).json({ error: "Friends not found" });
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving friends:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

export default router;
