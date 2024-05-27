import express from "express";
import {
  insertSchedule,
  deleteSchedule,
} from "../services/schedulesService.js";

const router = express.Router();

// these are for owners that would like to join the meetup
// but they are not the host.
router.post("/insert-schedule", async (req, res) => {
  const { meetupID, ownerID } = req.body;
  const insertResult = await insertSchedule(meetupID, ownerID);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/:meetupid/:ownerid/delete-schedule", async (req, res) => {
  const meetupID = req.params.meetupid;
  const ownerID = req.params.ownerid;
  const insertResult = await deleteSchedule(meetupID, ownerID);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});
export default router;
