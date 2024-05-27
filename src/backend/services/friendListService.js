import pool from "./databaseService.js";

/**
 * Fetches all friendships(id1, id2, date). Use this to template fetch functions.
 * @returns results
 */
async function fetchFriendListFromDB() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM Friendship");
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching owners from the database:", error);
    throw error;
  }
}
async function initiateOwners() {
  // Add the tables you want to create.
  const createTableQueries = [
    "Owner (ownerID SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL)",
    "Owner_Name (ownerID INTEGER PRIMARY KEY, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, FOREIGN KEY (ownerID) REFERENCES Owner (ownerID) ON DELETE CASCADE)",
    "Owner_Contact (email VARCHAR(255) PRIMARY KEY, phoneNumber VARCHAR(255) UNIQUE, FOREIGN KEY (email) REFERENCES Owner (email) ON DELETE CASCADE ON UPDATE CASCADE)",
  ];

  // Add the table names tht should be dropped. Should be the same tables on createTableQueries.
  const dropTables = ["Owner_Name", "Owner_Contact", "Owner"]; // Make sure the order is Dependent->Source. Remove tables that depends on another table.

  try {
    const client = await pool.connect();
    for (const table of dropTables) {
      await client.query(`DROP TABLE IF EXISTS ${table}`);
    }
    for (const query of createTableQueries) {
      await client.query(`CREATE TABLE IF NOT EXISTS ${query}`);
    }
    client.release();
    return true;
  } catch (error) {
    console.error("Error initializing owners:", error);
    throw error;
  }
}

async function insertFriendship(ownerid1, ownerid2, dateoffriendship) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const friendListInsertQuery1 =
      "INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES ($1, $2, $3)";
    const friendListInsertValues1 = [ownerid1, ownerid2, dateoffriendship];
    await client.query(friendListInsertQuery1, friendListInsertValues1);

    const friendListInsertQuery2 =
      "INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES ($2, $1, $3)";
    const friendListInsertValues2 = [ownerid1, ownerid2, dateoffriendship];
    await client.query(friendListInsertQuery2, friendListInsertValues2);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting friendship:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function deleteFriendship(ownerid1, ownerid2) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const friendListDeleteQuery1 =
      "DELETE FROM friendship WHERE ownerid1 = $1 AND ownerid2 = $2";
    const friendListDeleteValues1 = [ownerid1, ownerid2];
    await client.query(friendListDeleteQuery1, friendListDeleteValues1);

    const friendListDeleteQuery2 =
      "DELETE FROM friendship WHERE ownerid1 = $2 AND ownerid2 = $1";
    const friendListDeleteValues2 = [ownerid1, ownerid2];
    await client.query(friendListDeleteQuery2, friendListDeleteValues2);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting friendship:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// fetches names and ownerIDs of friends of the owner
async function fetchFriendsForProfilePage(ownerID) {
  try {
    const client = await pool.connect();
    const query = {
      text: `
          SELECT f.ownerid2, CONCAT(own.firstName, ' ', own.lastName) AS owner_name, f.dateoffriendship, o.email, contact.phonenumber
          FROM Friendship f 
          JOIN Owner_Name own ON own.ownerid = f.ownerid2
          JOIN Owner o ON o.ownerid = f.ownerid2
          JOIN Owner_Contact contact ON contact.email = o.email
          WHERE f.ownerid1 = $1
    `,
      values: [ownerID],
    };
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching data for post from the database:", error);
    throw error;
  }
}

export {
  fetchFriendListFromDB,
  initiateOwners,
  insertFriendship,
  deleteFriendship,
  fetchFriendsForProfilePage,
};
