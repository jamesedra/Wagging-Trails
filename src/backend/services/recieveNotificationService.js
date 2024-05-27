import pool from "./databaseService.js";

async function fetchNotificationsFromDB(ownerID) {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM receives_notifications WHERE ownerid = $1", [ownerID]);
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    throw error;
  }
}

async function insertNotification(ownerId, notificationId, notifContent) {
    let client;
    try {
      client = await pool.connect();

      // Start transaction
      await client.query("BEGIN");

      const notifInsertQuery =
        "INSERT INTO receives_notifications (ownerId, notificationId, notifContent) VALUES ($1, $2, $3)";
      const notifInsertValues = [ownerId, notificationId, notifContent];
      const notifResult = await client.query(notifInsertQuery, notifInsertValues);
  
      // Commit the transaction
      await client.query("COMMIT");
      return true;
    } catch (error) {
      // Rollback the transaction in case of error
      await client.query("ROLLBACK");
      console.error("Error inserting notification:", error);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async function deleteNotification(notificationID) {
    let client;
    try {
        client = await pool.connect();

        // Start transaction
        await client.query("BEGIN");

        const deleteQuery =
            "DELETE FROM receives_notifications WHERE notificationId = $1";
        const deleteValues = [notificationID];
        const deleteResult = await client.query(deleteQuery, deleteValues);
        console.log("Deleted notification:", deleteResult.rowCount);

        // Commit the transaction
        await client.query("COMMIT");
        return true;
    } catch (error) {
        // Rollback the transaction in case of error
        await client.query("ROLLBACK");
        console.error("Error deleting notification:", error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}


export {fetchNotificationsFromDB, insertNotification, deleteNotification };
