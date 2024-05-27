import express from "express";
import { 
  insertNotification,
  fetchNotificationsFromDB,
  deleteNotification
} from "../services/recieveNotificationService.js";


const router = express.Router();

router.get("/:ownerID", async (req, res) => {
  const ownerID = req.params.ownerID;
  const tableContent = await fetchNotificationsFromDB(ownerID);
  res.json({ data: tableContent });
});

router.post("/insert-notif", async (req, res) => {
  const { ownerId, notificationId, notifContent } = req.body;
  const insertResult = await insertNotification(
    ownerId,
    notificationId,
    notifContent
  );
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/delete-notif/", async (req, res) => {
  const { notificationID } = req.body;
  const deleteResult = await deleteNotification(notificationID);
  if (deleteResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});


router.get("/:ownerID", async (req, res) => {
  try {
    const ownerID = req.params.ownerID;
    const tableContent = await fetchOwnerProfilePage(ownerID);
    if (!tableContent) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving owner profile:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

export default router;
