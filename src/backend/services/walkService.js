import pool from "./databaseService.js";

async function walkSetup() {
  try {
    // use this if there is a dependency.
    // const dependencyTableExist = await dependencyTableExists();
    // if (!dependencyTableExist) await dependencySetup();

    const validity = await initiateWalk();
    return validity;
  } catch (error) {
    console.error("Error setting up Walk:", error);
    throw error;
  }
}

/**
 * Initializes three normalized, walk tables.
 * Drops existing tables to have a fresh set of tables.
 *
 * @returns true or error message.
 */
async function initiateWalk() {
  // Add the tables you want to create.
  const createTableQueries = [
    "Walk (walkID SERIAL PRIMARY KEY, location VARCHAR(255) NOT NULL)",
    "Walk_Date (walkID INTEGER PRIMARY KEY, date DATE, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE CASCADE)",
    "Walk_Dist (walkID INTEGER PRIMARY KEY, distance FLOAT, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE CASCADE)",
  ];

  // Add the table names tht should be dropped. Should be the same tables on createTableQueries.
  const dropTables = ["Walk_Date", "Walk_Dist", "Walk"]; // Make sure the order is Dependent->Source. Remove tables that depends on another table.

  try {
    const client = await pool.connect();
    for (const table of dropTables) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
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

async function checkWalkTableExists() {
  try {
    const query = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'Walk'
      );
    `;

    const result = await pool.query(query);
    // result.rows[0].exists will be true if the table exists, otherwise false
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking if Walk table exists:", error);
    throw error;
  }
}

async function insertWalk(location, date, distance) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const walkInsertQuery =
      "INSERT INTO Walk (location) VALUES ($1) RETURNING walkID";
    const walkInsertValues = [location];
    const walkResult = await client.query(walkInsertQuery, walkInsertValues);
    const walkID = walkResult.rows[0].walkid;

    const dateInsertQuery =
      "INSERT INTO Walk_Date (walkID, date) VALUES ($1, $2)";
    const dateInsertValues = [walkID, date];
    await client.query(dateInsertQuery, dateInsertValues);

    const distInsertQuery =
      "INSERT INTO Walk_Dist (walkID, distance) VALUES ($1, $2)";
    const distInsertValues = [walkID, distance];
    await client.query(distInsertQuery, distInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return walkID;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting walk:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function fetchDogPerWalkCounter(ownerID) {
  try {
    const client = await pool.connect();
    const query = {
      text: `
      SELECT num_dogs, COUNT(*) AS num_walks
      FROM (
            SELECT w.walkid, COUNT(wf.dogid) AS num_dogs
            FROM Walk w 
            JOIN WentFor wf ON w.walkid = wf.walkid 
            WHERE w.walkid IN (
                      SELECT wf.walkid
                      FROM WentFor wf
                      JOIN owns_dog od ON wf.dogid = od.dogid
                      WHERE od.ownerid = $1
            )
            GROUP BY w.walkid
      ) AS walk_dog_count
      GROUP BY num_dogs
      ORDER BY num_dogs DESC
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

// should retrieve walkID, dogID, dogName, and date of walk.
// if postID is null, we can provide a chance for the owner to
// create the post for the said walk.
// also check if it's a meetup walk.
// get ownerID if they made a post
async function fetchAllWalks(ownerID) {
  try {
    const client = await pool.connect();
    const query = {
      text: `
      SELECT w.walkID, COUNT (DISTINCT od.dogID) AS num_dogs,
      ARRAY_AGG(DISTINCT od.dogID) as dogIDs, 
      ARRAY_AGG(DISTINCT od.name) as dogs, w.location, wf.rating,
      wd.date, wdi.distance, 
      om.meetupID, 
      array_agg(DISTINCT CONCAT(own1.firstName, ' ', own1.lastName)) 
            FILTER (WHERE CONCAT(own1.firstName, ' ', own1.lastName) IS NOT NULL 
            AND own1.ownerID <> od.ownerID) 
              AS met_up_owners,
      pw.postID, 
      pwo.ownerID,
      array_agg(DISTINCT own1.ownerID) AS met_up_ownerids
      FROM Walk w 
      JOIN WentFor wf ON w.walkID = wf.walkID
      JOIN Owns_Dog od ON wf.dogID = od.dogID
      LEFT JOIN Walk_Date wd ON w.walkID = wd.walkID
      LEFT JOIN Walk_Dist wdi ON w.walkID = wdi.walkID 
      LEFT JOIN Post_Walk pw ON w.walkID = pw.walkID
      LEFT JOIN Post_Walk_Owner pwo ON pw.postID = pwo.postID
      LEFT JOIN On_MeetUp om ON w.walkID = om.walkID
      LEFT JOIN Schedules s ON om.meetUpID = s.meetUpID
      LEFT JOIN Owner_Name own1 ON s.ownerID = own1.ownerID
      WHERE w.walkid IN (
                      SELECT wf.walkid
                      FROM WentFor wf
                      JOIN owns_dog od ON wf.dogid = od.dogid
                      WHERE od.ownerid = $1
            )
      GROUP BY w.walkID, wd.date, wdi.distance, om.meetupID, pw.postID, pwo.ownerID, wf.rating
      ORDER BY wd.date DESC NULLS LAST;
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

async function deleteWalk(walkid) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const deleteWalk1 =
      "DELETE from schedules where meetupid = (SELECT meetupid from on_meetup WHERE walkid = $1)";
    const deleteWalkValues1 = [walkid];
    await client.query(deleteWalk1, deleteWalkValues1);

    const deleteWalk2 =
      "DELETE from taggedin where postid = (SELECT postid from post_walk WHERE walkid = $1)";
    const deleteWalkValues2 = [walkid];
    await client.query(deleteWalk2, deleteWalkValues2);

    const deleteWalk = "DELETE from walk WHERE walkid = $1";
    const deleteWalkValues = [walkid];
    await client.query(deleteWalk, deleteWalkValues);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting walk:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function updateWalkLocaton(walkid, newLocation) {
  try {
    const client = await pool.connect();
    const query1 = "UPDATE walk SET location = $1 where walkid = $2";
    const queryValues = [newLocation, walkid];
    await client.query(query1, queryValues);

    client.release();
    return true;
  } catch (error) {
    console.error("Error updating walk location:", error);
    throw error;
  }
}

async function updateWalkDate(walkid, newDate) {
  try {
    const client = await pool.connect();
    const query1 = "UPDATE walk_date SET date = $1 where walkid = $2";
    const queryValues = [newDate, walkid];
    await client.query(query1, queryValues);

    client.release();
    return true;
  } catch (error) {
    console.error("Error updating walk date:", error);
    throw error;
  }
}

async function updateWalkDistance(walkid, newDistance) {
  try {
    const client = await pool.connect();
    const query1 = "UPDATE walk_dist SET distance = $1 where walkid = $2";
    const queryValues = [newDistance, walkid];
    await client.query(query1, queryValues);

    client.release();
    return true;
  } catch (error) {
    console.error("Error updating walk distance:", error);
    throw error;
  }
}

export {
  walkSetup,
  checkWalkTableExists,
  insertWalk,
  fetchAllWalks,
  deleteWalk,
  updateWalkLocaton,
  updateWalkDate,
  updateWalkDistance,
  fetchDogPerWalkCounter,
};
