import pool from "./databaseService.js";

/**
 * DEV NOTE: This service file currently contains basic
 * SQL select, drop/create table, update functions
 * that you can use to template more complex queries.
 *
 * It should be a bit more easier to read than last time.
 */

/**
 * Fetches Owner(id, email). Use this to template fetch functions.
 * @returns results
 */
async function fetchOwnersFromDB() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM Owner");
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching owners from the database:", error);
    throw error;
  }
}

async function fetchOwnerProfilePage(ownerID) {
  try {
    const client = await pool.connect();
    const query = {
      text: `
          SELECT 
            CONCAT(own.firstName, ' ', own.lastName) AS owner_name,
            o.email,
            owc.phoneNumber
          FROM Owner o 
          JOIN Owner_Name own ON o.ownerID = own.ownerID 
          JOIN Owner_Contact owc ON owc.email = o.email
          WHERE o.ownerID = $1;
    `,
      values: [ownerID],
    };
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching data of the owner from the database:", error);
    throw error;
  }
}

/**
 * Initializes three normalized, owner tables.
 * Drops existing tables to have a fresh set of tables.
 * For testing, you can use this to refresh your tables.
 * (eg. your compound insert statement got an error and
 * only inserted 2/4 normalized tables)
 *
 * @returns true or error message.
 */
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

//----------------------------------------------------------------
// NOTE.
// This is a large, compound insert function for three tables.
// (Owner, Owner_Name, Owner_Contact). This was constructed
// in a way the dependencies needed for Owner_Name is satisfied.
// Use this method to construct the normalized tables when
// dependencies are needed.
//----------------------------------------------------------------
async function insertOwner(email, firstName, lastName, phoneNumber) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const ownerInsertQuery =
      "INSERT INTO Owner (email) VALUES ($1) RETURNING ownerID"; // RETURNING ownerID gets the ownerID for Owner_Name to use.
    const ownerInsertValues = [email];
    const ownerResult = await client.query(ownerInsertQuery, ownerInsertValues);
    const ownerID = ownerResult.rows[0].ownerid;

    const nameInsertQuery =
      "INSERT INTO Owner_Name (ownerID, firstName, lastName) VALUES ($1, $2, $3)";
    const nameInsertValues = [ownerID, firstName, lastName];
    await client.query(nameInsertQuery, nameInsertValues);

    const contactInsertQuery =
      "INSERT INTO Owner_Contact (email, phoneNumber) VALUES ($1, $2)";
    const contactInsertValues = [email, phoneNumber];
    await client.query(contactInsertQuery, contactInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting owner:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * Updates first and last names of an owner.
 *
 * @param {INTEGER} ownerID
 * @param {VARCHAR} newFirstName
 * @param {VARCHAR} newLastName
 * @returns
 */
async function updateOwnerName(ownerID, newFirstName, newLastName) {
  try {
    const client = await pool.connect();
    const query =
      "UPDATE owner_name SET firstName = $1, lastName = $2 WHERE ownerID = $3";
    const values = [newFirstName, newLastName, ownerID];
    await client.query(query, values);
    client.release();
    return true;
  } catch (error) {
    console.error("Error updating owner name:", error);
    throw error;
  }
}

/**
 * Updates email and phone number of an owner.
 * @param {INTEGER} ownerID
 * @param {VARCHAR} email
 * @param {VARCHAR} newPhoneNumber
 * @returns
 */
async function updateOwnerContact(ownerID, email, newPhoneNumber) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const emailQuery = "UPDATE owner SET email = $1 WHERE ownerID = $2";
    const emailValues = [email, ownerID];
    await client.query(emailQuery, emailValues);

    const phoneQuery =
      "UPDATE owner_contact SET phoneNumber = $1 WHERE email = $2";
    const phoneValues = [newPhoneNumber, email];
    await client.query(phoneQuery, phoneValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error updating owner contact:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function searchForOwners(sometext) {
  try {
    const client = await pool.connect();
    const query = `SELECT ownerid, CONCAT(firstname, ' ', lastname) AS owner_name
                  FROM owner_name 
                  WHERE lower(firstname) LIKE $1 OR lower(lastname) LIKE $1
                  GROUP BY ownerid
                  ORDER BY firstname, lastName`;

    const result = await client.query(query, [`${sometext}%`]);
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching data of the owner:", error);
    throw error;
  }
}

export {
  fetchOwnersFromDB,
  initiateOwners,
  insertOwner,
  updateOwnerName,
  updateOwnerContact,
  fetchOwnerProfilePage,
  searchForOwners,
};
