import express from "express";

import { fillDB } from "../services/databaseService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("hello there");
});

router.post("/initiate-all", async (req, res) => {
  const initiateResult = await initiateDB();
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/fill-all", async (req, res) => {
  const fillResult = await fillDB();
  if (fillResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
