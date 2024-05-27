import pool from "./databaseService.js";

async function insertSchedule(meetupID, ownerID) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const scheduleInsertQuery =
      "INSERT INTO schedules (meetupID, ownerID) VALUES ($1, $2)";
    const scheduleInsertValues = [meetupID, ownerID];
    await client.query(scheduleInsertQuery, scheduleInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting schedule:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function deleteSchedule(meetupID, ownerID) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const scheduleDeleteQuery =
      "DELETE FROM schedules WHERE meetupid = $1 AND ownerid = $2";
    const scheduleDeleteValues = [meetupID, ownerID];
    await client.query(scheduleDeleteQuery, scheduleDeleteValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting schedule:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export { insertSchedule, deleteSchedule };
