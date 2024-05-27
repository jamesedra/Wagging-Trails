import express from "express";
import { deleteDog, dogsForOwner, fetchAllDogFriends, fetchDogsFromDB, insertDog, updateDogBday, updateDogBreed, updateDogName, updateOwnerForDog, selectDogDetails } from "../services/ownsDogService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tableContent = await fetchDogsFromDB();
  res.json({ data: tableContent });
});

router.post("/insert-dog", async (req, res) => {
  const { ownerID, name, breed, birthday } = req.body;
  const insertResult = await insertDog(ownerID, name, breed, birthday);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:dogID/update-dog-owner", async (req, res) => {
  const { ownerIDNew} = req.body;
  const dogID = req.params.dogID;
  const updateResult = await updateOwnerForDog(ownerIDNew, dogID);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/delete-dog", async (req, res) => {
  const { dogID} = req.body;
  const deleteResult = await deleteDog(
      dogID
  );
  if (deleteResult) {
      res.json({ success: true });
  } else {
      res.status(500).json({ success: false });
  }
  });

  router.get("/:ownerid/get-dog-for", async (req, res) => {
    try {
      const ownerid = req.params.ownerid;
      const tableContent = await dogsForOwner(ownerid);
      if (!tableContent) {
        res.status(404).json({error: "Owner not found"});
        return;
      }
      res.json({data: tableContent});
  
    } catch (err) {
      console.error("Error retrieving dogs for owner: ", err);
      res.status(500).json({err: "Internal server error"});
    }
  });

  router.put("/:dogid/update-dog-name", async (req,res) => {
    const { dogname } = req.body;
    const dogid = req.params.dogid;
    const updateResult = await updateDogName(dogid, dogname);
    if (updateResult) {
      res.json({success : true});
    } else {
      res.status(500).json({ success: false});
    }
});

router.put("/:dogid/update-dog-breed", async (req,res) => {
  const { dogbreed } = req.body;
  const dogid = req.params.dogid;
  const updateResult = await updateDogBreed(dogid, dogbreed);
  if (updateResult) {
    res.json({success : true});
  } else {
    res.status(500).json({ success: false});
  }
});

router.put("/:dogid/update-dog-bday", async (req,res) => {
  const { dogbday } = req.body;
  const dogid = req.params.dogid;
  const updateResult = await updateDogBday(dogid, dogbday);
  if (updateResult) {
    res.json({success : true});
  } else {
    res.status(500).json({ success: false});
  }
});

router.get("/:ownerid/fetch-all-dog-friends", async (req, res) => {
  try {
    const ownerid = req.params.ownerid;
    const result = await fetchAllDogFriends(ownerid);
    if (!result) {
      res.status(404).json({error: "Owner not found"});
      return;
    }
    res.json({data: result});

  } catch (err) {
    console.error("Error retrieving dogs for owner and friends: ", err);
    res.status(500).json({err: "Internal server error"});
  }
});

router.get("/:dogid/:cond", async (req, res) => {
  try {
    const dogid = req.params.dogid;
    const cond = req.params.cond
    const tableContent = await selectDogDetails(dogid, cond);
    
    if (!tableContent) {
      res.status(404).json({ error: "Dog not found" });
      return;
    }
    
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving dog details: ", err);
    res.status(500).json({ err: "Internal server error" });
  }
});



export default router;
