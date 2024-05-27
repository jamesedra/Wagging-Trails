import pool from "./databaseService.js";

async function insertTaggedDog(dogIDs, postID) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    // Insert tags using a loop
    for (const dog of dogIDs) {
      const tagInsertQuery =
        "INSERT INTO TaggedIn (dogID, postID) VALUES ($1, $2)";
      const tagInsertValues = [dog, postID];
      await client.query(tagInsertQuery, tagInsertValues);
    }

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting tagged dogs:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function deleteTaggedIn(postID) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const deleteQuery = "DELETE from taggedin WHERE postid = $1";
    const deleteValues = [postID];
    await client.query(deleteQuery, deleteValues);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting taggedDogs:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function findAllTags(tags) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const createQuery = "CREATE TABLE all_tags (tag VARCHAR(255) PRIMARY KEY)";
    const tagTable = await client.query(createQuery);

    for (const tag of tags) {
      const tagInsertQuery = "INSERT INTO all_tags (tag) VALUES ($1)";
      const tagInsertValues = [tag];
      await client.query(tagInsertQuery, tagInsertValues);
    }

    const query = `
          SELECT 
          pw.postID,
          w.walkID,
          array_agg(DISTINCT od.name) AS dogs,
          own.ownerID,
          CONCAT(own.firstName, ' ', own.lastName) AS owner_name,
          w.location,
          array_agg(DISTINCT pm.url) AS urls,
          array_agg(DISTINCT CONCAT(own1.firstName, ' ', own1.lastName)) 
            FILTER (WHERE CONCAT(own1.firstName, ' ', own1.lastName) IS NOT NULL 
            AND own1.ownerID <> own.ownerID) 
              AS met_up_owners,
          array_agg(DISTINCT pwt.tag) AS tags
          FROM Post_Walk pw
          JOIN Walk w ON pw.walkID = w.walkID
          JOIN WentFor wf ON w.walkID = wf.walkID
          JOIN Owns_Dog od ON wf.dogID = od.dogID
          JOIN Post_Walk_Owner pwo ON pw.postID = pwo.postID
          JOIN Owner_Name own ON own.ownerID = pwo.ownerID
          
          LEFT JOIN Post_Media pm ON pw.postID = pm.postID
          LEFT JOIN Post_Walk_Tag pwt ON pw.postID = pwt.postID
          LEFT JOIN On_MeetUp omu ON w.walkID = omu.walkID
          LEFT JOIN Walk_Date wd ON w.walkID = wd.walkID
          LEFT JOIN Schedules s ON omu.meetUpID = s.meetUpID
          LEFT JOIN Owner_Name own1 ON s.ownerID = own1.ownerID
          WHERE EXISTS (SELECT DISTINCT p.postid
                        FROM post_walk_tag p
                        WHERE NOT EXISTS (SELECT tag  
                                          FROM all_tags pp 
                                          EXCEPT SELECT pp.tag 
                                                FROM post_walk_tag pp 
                                                WHERE p.postid = pp.postid) AND p.postid = pw.postid) 
          GROUP BY pw.postID, w.walkID, own.ownerID, own.firstName, own.lastName, w.location, wd.date
          ORDER BY pw.postID DESC, wd.date DESC;
    `;

    // const divisionQuery = `
    // SELECT DISTINCT p.postid
    // FROM post_walk_tag p
    // WHERE NOT EXISTS (SELECT tag
    //                   FROM all_tags pp
    //                   EXCEPT SELECT pp.tag
    //                         FROM post_walk_tag pp
    //                         WHERE p.postid = pp.postid)`;
    const result = await client.query(query);

    const deleteAllTags = "DROP TABLE IF EXISTS all_tags";
    await client.query(deleteAllTags);

    // Commit the transaction
    await client.query("COMMIT");

    return result.rows;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error discovering post:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export { insertTaggedDog, deleteTaggedIn, findAllTags };
