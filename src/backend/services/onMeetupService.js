import pool from "./databaseService.js";

async function insertMeetup(walkID, time, location, date, ownerID) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const meetupInsertQuery =
      "INSERT INTO On_Meetup (walkID, time, location, date) VALUES ($1, $2, $3, $4) RETURNING meetupID";
    const meetupInsertValues = [walkID, time, location, date];
    const meetupResult = await client.query(
      meetupInsertQuery,
      meetupInsertValues
    );
    const meetupID = meetupResult.rows[0].meetupid;

    // const scheduleInsertQuery =
    //   "INSERT INTO schedules (meetupID, ownerID) VALUES ($1, $2)";
    // const scheduleInsertValues = [meetupID, ownerID];
    // await client.query(scheduleInsertQuery, scheduleInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return meetupID;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting meetup or schedule:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function updateMeetupTime(meetUpId, newTime) {
  try {
    const client = await pool.connect();
    const query1 = "UPDATE on_meetup SET time = $1 where meetupid = $2";
    const queryValues = [newTime, meetUpId];
    await client.query(query1, queryValues);

    client.release();
    return true;
  } catch (error) {
    console.error("Error updating meetup time:", error);
    throw error;
  }
}

async function updateMeetupLocation(meetUpId, newLocation) {
  try {
    const client = await pool.connect();
    const query1 = "UPDATE on_meetup SET location = $1 where meetupid = $2";
    const queryValues = [newLocation, meetUpId];
    await client.query(query1, queryValues);

    client.release();
    return true;
  } catch (error) {
    console.error("Error updating meetup location:", error);
    throw error;
  }
}

async function updateMeetupDate(meetUpId, newDate) {
  try {
    const client = await pool.connect();
    const query1 = "UPDATE on_meetup SET date = $1 where meetupid = $2";
    const queryValues = [newDate, meetUpId];
    await client.query(query1, queryValues);

    client.release();
    return true;
  } catch (error) {
    console.error("Error updating meetup date:", error);
    throw error;
  }
}

async function deleteMeetup(meetupid) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const deleteMeetupQuery = "DELETE from on_meetup WHERE meetupid = $1";
    const deleteMeetupValues = [meetupid];
    await client.query(deleteMeetupQuery, deleteMeetupValues);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting meetup:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export {
  insertMeetup,
  updateMeetupTime,
  updateMeetupLocation,
  updateMeetupDate,
  deleteMeetup,
};
