import pool from "./databaseService.js";

async function fetchFromDB() {}

// should retrieve walkID, dogName, and date of walk.
async function fetchOwnerWalkTask(ownerID) {
  try {
    const client = await pool.connect();
    const query = {
      text: `
      SELECT owt.taskID, ARRAY_AGG(wa.notificationID) AS notificationIDs, ARRAY_AGG(wa.dogName) AS dogNames, owt.date, owt.walkeventtype
      FROM Organizes_WalkTask owt 
      JOIN Logs l ON owt.taskID = l.taskID
      JOIN WalkAlert wa ON l.notificationID = wa.notificationID
      WHERE owt.ownerID = $1
      GROUP BY owt.taskID, owt.date, owt.walkeventtype
      ORDER BY owt.date DESC NULLS LAST;
    `,
      values: [ownerID],
    };
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching data walk tasks from database:", error);
    throw error;
  }
}

async function insertWalkTask(
  ownerID,
  notifContent,
  dogName,
  date,
  walkeventtype
) {
  let client;
  try {
    client = await pool.connect();
    // Start transaction
    await client.query("BEGIN");

    const notifInsertQuery =
      "INSERT INTO Receives_Notifications (ownerID, notifContent) VALUES ($1, $2) RETURNING notificationID";
    const notifInsertValues = [ownerID, notifContent];
    const notifResult = await client.query(notifInsertQuery, notifInsertValues);
    const notificationID = notifResult.rows[0].notificationid;

    const walkAlertInsertQuery =
      "INSERT INTO walkalert (notificationID, dogName) VALUES ($1, $2)";
    const walkAlertInsertValues = [notificationID, dogName];
    await client.query(walkAlertInsertQuery, walkAlertInsertValues);

    const taskInsertQuery =
      "INSERT INTO organizes_walktask (ownerID, date, walkeventtype) VALUES ($1, $2, $3) RETURNING taskID";
    const taskInsertValues = [ownerID, date, walkeventtype];
    const taskResult = await client.query(taskInsertQuery, taskInsertValues);
    const taskID = taskResult.rows[0].taskid;

    const logsInsertQuery =
      "INSERT INTO logs (notificationID, taskID) VALUES ($1, $2)";
    const logsInsertValues = [notificationID, taskID];
    await client.query(logsInsertQuery, logsInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return taskID;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting notification and walk tasks:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

//fn to create recevies_notifs and walkalert together
async function insertReceivesAndWalk(ownerid, notifcontent, dogname) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const insertReceivesNotif =
      "INSERT INTO receives_notifications ( ownerid, notifcontent) VALUES ($1, $2) RETURNING notificationid";
    const insertReceivesNotifValues = [ownerid, notifcontent];
    const result = await client.query(
      insertReceivesNotif,
      insertReceivesNotifValues
    );
    const notiID = result.rows[0].notificationid;

    const insertWalkAlert =
      "INSERT INTO walkalert (notificationid, dogname) VALUES ($1, $2)";
    const insertWalkAlertValues = [notiID, dogname];
    await client.query(insertWalkAlert, insertWalkAlertValues);

    await client.query("COMMIT");
    return notiID;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error ", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function insertOrganizesWalk(ownerID, date, walkEventType) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");
    const organizesWalkQuery =
      "INSERT INTO organizes_walktask (ownerid, date, walkeventtype) VALUES ($1, $2, $3) RETURNING taskid";
    const organizesWalkValues = [ownerID, date, walkEventType];
    const result = await client.query(organizesWalkQuery, organizesWalkValues);
    const taskID = result.rows[0].taskid;

    await client.query("COMMIT");
    return taskID;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting organizes_walk:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function insertLog(notificationID, taskID) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");
    const logQuery =
      "INSERT INTO logs (notificationid, taskid) VALUES ($1, $2)";
    const logValues = [notificationID, taskID];
    await client.query(logQuery, logValues);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting log:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function deleteLog(notificationID, taskID) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");
    const deleteLogQuery =
      "DELETE from logs WHERE notificationid = $1 AND taskid = $2";
    const deleteLogValues = [notificationID, taskID];
    await client.query(deleteLogQuery, deleteLogValues);
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting log:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function deleteOrganizeWalk(taskID) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");
    const deleteOrganizes = "DELETE from organizes_walktask WHERE taskid = $1";
    const deleteOrganizesValue = [taskID];
    await client.query(deleteOrganizes, deleteOrganizesValue);

    await client.query("COMMIT");

    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting walktask:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function deleteReceivesAndWalk(notificationID) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");
    const deleteQuery = "DELETE from walkalert WHERE notificationid = $1";
    const deleteValues = [notificationID];
    await client.query(deleteQuery, deleteValues);

    const deleteQuery1 =
      "DELETE from receives_notifications WHERE notificationid = $1";
    const deleteValue1 = [notificationID];
    await client.query(deleteQuery1, deleteValue1);

    await client.query("COMMIT");

    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting receives and walkalert:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export {
  fetchFromDB,
  fetchOwnerWalkTask,
  insertWalkTask,
  insertReceivesAndWalk,
  insertOrganizesWalk,
  insertLog,
  deleteLog,
  deleteOrganizeWalk,
  deleteReceivesAndWalk,
};
