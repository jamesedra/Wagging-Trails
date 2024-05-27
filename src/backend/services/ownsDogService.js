import pool from "./databaseService.js";

async function fetchDogsFromDB() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT d.dogid, d.ownerid, d.name, d.breed, b.birthday  FROM owns_dog d INNER JOIN owns_dog_birthday b ON (d.dogid = b.dogid)");
    

    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching dogs from the database:", error);
    throw error;
  }
}

//inserts a new dog
async function insertDog(ownerID, name, breed, birthday) {
  let client;
  try {
    client = await pool.connect();
    console.log(ownerID);

    // Start transaction
    await client.query("BEGIN");

    const dogInsertQuery =
      "INSERT INTO Owns_Dog (ownerID, name, breed) VALUES ($1, $2, $3) RETURNING dogID";
    const dogInsertValues = [ownerID, name, breed];
    const dogResult = await client.query(dogInsertQuery, dogInsertValues);
    const dogID = dogResult.rows[0].dogid;

    const dateInsertQuery =
      "INSERT INTO Owns_Dog_Birthday (dogID, ownerID, name, birthday) VALUES ($1, $2, $3, $4)";
    const dateInsertValues = [dogID, ownerID, name, birthday];
    await client.query(dateInsertQuery, dateInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting dog:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

//updates the owner of a dog
async function updateOwnerForDog(ownerIDNew, dogID) {
  try {
    const client = await pool.connect();
    await client.query("BEGIN");
    const query1 = "UPDATE owns_dog SET ownerid = $1 WHERE dogID = $2";
    const values = [ownerIDNew, dogID];
    await client.query(query1, values);

    const query2 = "UPDATE owns_dog_birthday SET ownerid =$1 WHERE dogID = $2";
    const bday_values = [ownerIDNew, dogID];
    await client.query(query2, bday_values);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    console.error("Error updating dog owner:", error);
    throw error;
  }
}

//deletes a dog tuple
async function deleteDog(dogID) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const deleteDogQuery1 = "DELETE from owns_dog WHERE dogid = $1";
    const deleteDogValues1 = [dogID];
    await client.query(deleteDogQuery1, deleteDogValues1);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting dog:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

//returns all tuples for a dogs owned by a given ownerid
async function dogsForOwner(ownerid) {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const getDog = "SELECT * from owns_dog where ownerid = $1";
    const getDogValues = [ownerid];
    const results = await client.query(getDog, getDogValues);

    await client.query("COMMIT");
    return results.rows;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error retrieving dogs:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

//updates names for a dog based on dogid
async function updateDogName(dogid, newDogName) {
  let client;
  try {
    client = await pool.connect();
    const query1 = "UPDATE owns_dog SET name = $1 WHERE dogid = $2";
    const query1Values = [newDogName, dogid];
    await client.query(query1, query1Values);

    const query2 = "UPDATE owns_dog_birthday SET name = $1 where dogid = $2";
    const query2Values = [newDogName, dogid];
    await client.query(query2, query2Values);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error updating dog name:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

//updates dog breed for a given dogID
async function updateDogBreed(dogid, newDogBreed) {
  try {
    const client = await pool.connect();
    const query1 = "UPDATE owns_dog SET breed = $1 where dogid = $2";
    const queryValues = [newDogBreed, dogid];
    await client.query(query1, queryValues);

    client.release();
    return true;
  } catch (error) {
    console.error("Error updating dog breed:", error);
    throw error;
  }
}

async function updateDogBday(dogid, newDogBday) {
  try {
    const client = await pool.connect();
    const query1 =
      "UPDATE owns_dog_birthday SET birthday = $1 where dogid = $2";
    const queryValues = [newDogBday, dogid];
    await client.query(query1, queryValues);

    client.release();
    return true;
  } catch (error) {
    console.error("Error updating dog birthday:", error);
    throw error;
  }
}

async function fetchAllDogFriends(ownerID) {

  try {
    const client = await pool.connect();
    const query = "SELECT dogid, d.name FROM owns_dog d WHERE d.ownerid = $1 OR (d.ownerid IN (SELECT ownerid2 FROM friendship f WHERE f.ownerid1 = $1))";
    const values = [ownerID];
    const result = await client.query(query,values)

    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching dogs from the database:", error);
    throw error;
  }
}


async function selectDogDetails(dogid, cond) {
  try {
    const client = await pool.connect();

    let selectedFields = "*";
    if (cond == "name") {
      selectedFields = "name"
    } else if (cond == "breed") {
      selectedFields = "breed"
    } else if (cond == "both") {
      selectedFields = "name, breed"
    }

    const query = `SELECT ${selectedFields} FROM owns_dog WHERE dogid = $1`;
    const queryValues = [dogid];
    const result = await client.query(query, queryValues);

    client.release();
    console.log("selectFields", selectedFields);
    return result.rows; // Return rows from the SELECT query
  } catch (error) {
    console.error("Error selecting dog details:", error);
    throw error;
  }
}




export {
  fetchDogsFromDB,
  insertDog,
  updateOwnerForDog,
  deleteDog,
  dogsForOwner,
  updateDogName,
  updateDogBreed,
  updateDogBday,
  fetchAllDogFriends,
  selectDogDetails
  
};
