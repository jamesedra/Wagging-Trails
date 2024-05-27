import express from "express";
import {
  insertWentFor,
  updateWentFor,
  deleteWentFor,
} from "../services/wentForService.js";

const router = express.Router();

router.post("/insert-went-for", async (req, res) => {
  const { dogID, walkID, rating } = req.body;
  const insertResult = await insertWentFor(dogID, walkID, rating);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:walkid/update-wentfor", async (req, res) => {
  const { rating } = req.body;
  const walkid = req.params.walkid;
  const updateResult = await updateWentFor(walkid, rating);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/:walkid/:dogid/delete-went-for", async (req, res) => {
  const walkid = req.params.walkid;
  const dogid = req.params.dogid;
  const insertResult = await deleteWentFor(dogid, walkid);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
