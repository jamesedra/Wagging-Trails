import express from "express";
import {
  walkSetup,
  insertWalk,
  fetchAllWalks,
  deleteWalk,
  updateWalkLocaton,
  updateWalkDate,
  updateWalkDistance,
  fetchDogPerWalkCounter,
} from "../services/walkService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("hello there");
});

router.post("/initiate-walks", async (req, res) => {
  const initiateResult = await walkSetup();
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-walk", async (req, res) => {
  const { location, date, distance } = req.body;
  const walkID = await insertWalk(location, date, distance);
  if (walkID) {
    res.json({ success: true, walkID: walkID });
  } else {
    res.status(500).json({ success: false });
  }
});

// for side scheduling bar. Fetches all walks. UPCOMING WALKS WILL BE MANAGED BY WALK TASK.
router.get("/:ownerID", async (req, res) => {
  try {
    const ownerID = req.params.ownerID;
    const tableContent = await fetchAllWalks(ownerID);
    if (!tableContent) {
      res.status(404).json({ error: "Walks not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving walks:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

router.get("/walk-counter/:ownerID", async (req, res) => {
  try {
    const ownerID = req.params.ownerID;
    const tableContent = await fetchDogPerWalkCounter(ownerID);
    if (!tableContent) {
      res.status(404).json({ error: "Walks not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving walks:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

router.delete("/:walkid/delete-walk", async (req, res) => {
  const walkid = req.params.walkid;
  const deleteResult = await deleteWalk(walkid);
  if (deleteResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:walkid/update-walk-location", async (req, res) => {
  const { walklocation } = req.body;
  const walkid = req.params.walkid;
  const updateResult = await updateWalkLocaton(walkid, walklocation);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:walkid/update-walk-date", async (req, res) => {
  const { walkdate } = req.body;
  const walkid = req.params.walkid;
  const updateResult = await updateWalkDate(walkid, walkdate);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:walkid/update-walk-distance", async (req, res) => {
  const { walkdistance } = req.body;
  const walkid = req.params.walkid;
  const updateResult = await updateWalkDistance(walkid, walkdistance);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
