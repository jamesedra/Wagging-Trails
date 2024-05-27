import express from "express";
import {
  deleteMeetup,
  insertMeetup,
  updateMeetupDate,
  updateMeetupLocation,
  updateMeetupTime,
} from "../services/onMeetupService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("hello there");
});

// this insert meet up function is primarily for who hosts the meetup.
// owners that would like to join the meetup, will have to use the
// schedules functionality.
router.post("/insert-meetup", async (req, res) => {
  const { walkID, time, location, date, ownerID } = req.body;
  const insertResult = await insertMeetup(walkID, time, location, date);
  if (insertResult) {
    res.json({ success: true, meetupID: insertResult });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:meetupid/update-meetup-time", async (req, res) => {
  const { time } = req.body;
  const meetupid = req.params.meetupid;
  const updateResult = await updateMeetupTime(meetupid, time);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:meetupid/update-meetup-location", async (req, res) => {
  const { location } = req.body;
  const meetupid = req.params.meetupid;
  const updateResult = await updateMeetupLocation(meetupid, location);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:meetupid/update-meetup-date", async (req, res) => {
  const { date } = req.body;
  const meetupid = req.params.meetupid;
  const updateResult = await updateMeetupDate(meetupid, date);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/:meetupid/delete-meetup", async (req, res) => {
  const meetupid = req.params.meetupid;
  const deleteResult = await deleteMeetup(meetupid);
  if (deleteResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
