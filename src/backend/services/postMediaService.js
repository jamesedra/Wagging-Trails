import pool from "./databaseService.js";
import multer from "multer";
import path from "path";

// storage engine via multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination directory based on file's MIME type
    const uploadDir = file.mimetype.startsWith("image/")
      ? "../backend/uploads/images"
      : "../backend/uploads/videos";
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + " - " + Date.now() + path.extname(file.originalname)
    );
  },
});

// initialize upload, uses storage engine
const upload = multer({ storage: storage });

// ----------------------------------------------------------------
// Query functions here
// ----------------------------------------------------------------

async function insertMedia(fileName, date, mediaType, postID) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const mediaInsertQuery =
      "INSERT INTO Post_Media (postID, url) VALUES ($1, $2) RETURNING mediaID";
    const mediaInsertValues = [postID, fileName];
    const mediaResult = await client.query(mediaInsertQuery, mediaInsertValues);
    const mediaID = mediaResult.rows[0].mediaid;

    const dateInsertQuery =
      "INSERT INTO Post_Media_Date (url, dateCreated) VALUES ($1, $2)";
    const dateInsertValues = [fileName, date];
    const dateResult = await client.query(dateInsertQuery, dateInsertValues);

    const subInsertQuery =
      mediaType == "image"
        ? "INSERT INTO Photo (mediaID, filter) VALUES ($1, $2)"
        : "INSERT INTO Video (mediaID, duration) VALUES ($1, $2)";
    const subInsertValues = [mediaID, null];
    await client.query(subInsertQuery, subInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting media:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function deleteMedia(url) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const deletePhotoQuery1 = "DELETE from post_media WHERE url = $1";
    const deletePhotoValue = [url];
    await client.query(deletePhotoQuery1, deletePhotoValue);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting photo:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export { upload, insertMedia, deleteMedia };
