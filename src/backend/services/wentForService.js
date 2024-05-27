import pool from "./databaseService.js";

async function insertWentFor(dogID, walkID, rating) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const insertQuery =
      "INSERT INTO WentFor (dogID, walkID, rating) VALUES ($1, $2, $3)";
    const insertValues = [dogID, walkID, rating];
    await client.query(insertQuery, insertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting wentFor:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function updateWentFor(walkid, newRating) {
  try {
    const client = await pool.connect();
    const query1 = "UPDATE wentfor SET rating = $1 where walkid = $2";
    const queryValues = [newRating, walkid];
    await client.query(query1, queryValues);

    client.release();
    return true;
  } catch (error) {
    console.error("Error updating walk rating:", error);
    throw error;
  }
}

async function deleteWentFor(dogid, walkid) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const deleteQuery = "DELETE from wentfor WHERE dogid = $1 AND walkid = $2";
    const deleteValues = [dogid, walkid];
    await client.query(deleteQuery, deleteValues);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting wentfor:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export { insertWentFor, updateWentFor, deleteWentFor };
