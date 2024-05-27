# Backend Development Guide README

### _\*\*March 10 Week 1 Log_

This read me is edited to fit the PostgreSQL integration. Frontend documentation would be done soon. Please reinstall dependencies in src/backend.

This will be a detailed guide for our team to create the backend part of the project within format and done efficiently.

## Setting Up

### Applications Used

Not really required, but makes it easier to develop the back-end.

Postman: https://www.postman.com/downloads/

- used to test HTTPS methods (GET, POST, PUT)

### Installing Dependencies

Make sure to install everything first in the backend directory.

```
npm install
```

## Directory

```
src/
│
├── backend/
│   ├── controllers/   # controller files which call services files
│   ├── services/      # services files which handles calls to the db
|   ├── server.js      # calls controller files
|   ├── package.json   # packages for backend
|
├── client/
│   ├── # here would be our react files. More details in src/client/README.md
|   ├── package.json   # packages for front end

```

There are two main folders for developing the backend. Controller and services. **Each entity should have there own files of each** to separate entities and easier implementation.

## Starting the codebase

### Setting up your .env file

Create a file called .env in your src directory. We just need to have the data for back-end for now. Details are in the database properties in pgAdmin.

```
USER=your_username_on_pgAdmin
PASSWORD=your_password_on_pgAdmin
HOST=localhost
PORT=your_port_on_pgAdmin
DATABASE=your_database_on_pgAdmin
```

### Starting the program

use on the _backend/_ directory:

```
npm start
```

If the .env and other set ups are done correctly, you should see this in the terminal:

```
> project-304@1.0.0 start
> nodemon server.js

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
Server running at http://localhost:8800/
Server running at http://localhost:8800/
Pool connected.
Current user: postgres
```

We will be using _nodemon_ for fast prototyping. It restarts the program everytime we update the codebase. The deployment for now would also be in localhost port 8800, but we can change it later after prototyping.

## Developing Entities

You can do this in two ways:

- server.js->{**entity-name**}Controller.js->{**entity-name**}Service.js
- or the other way around.

This guide will be showing how to develop it in the first way.

### server.js

1. Add an import statement to the entity's controller you will develop. An example would be the ownerController:

```javascript
import ownerController from "./backend/controllers/ownerController.js";
```

2. Mount the router. This way, we can call the controllers separately via different addresses for the front end. Here is another example:

```javascript
app.use("/owner", ownerController);
```

### {**entity-name**}Controller.js

There would be three key things to consider while implementing:

**GET requests:** For fetching rows from the database.

**POST requests:** For inserting items into the database.

**PUT requests:** For updating rows from the database.

Note that the complexity of each one of these would depend on the entity being created. Which means Dog and Owner entities are the hardest to implement :pensive:

Here is an example of a simple GET request:

```javascript
router.get("/", async (req, res) => {
  const tableContent = await fetchOwnersFromDB();
  res.json({ data: tableContent });
});
```

For this example, since we are implementing this via this address:
http://localhost:8800/owner/

We would see a received json data depending on what content we the service returns.
Note that **router** from **router.get()** is just an object that handles routes and middleware stuff :smiley:

To prototype or test while coding this, you can use Postman which is very easy to use. You can set up a JSON file there as well and check if the database did update :smiley:

For more details on implementation and different requests, check _ownerController.js_. It has some documentation there as well.

### {**entity-name**}Service.js

:pensive: :pensive: :pensive:

Service files' complexity will depend on how complex the schemas are. There would be three keys as well for developing this:

1. **Initialization:** To instantly create tables without touching the workbench. The number of tables you create here depends on how many tables created after normalization.

2. **Destroying Tables:** _I haven't implemented this yet._

3. **Request Implementations:** Mostly the bulk of the work. The number of functions to be implemented will depend on how many functions created in the controller file.

**NOTE:** It may be easier to develop one function side-by-side with the controller function.

These are mainly asynchronous functions. In a very high-level explanation, the code will look like this:

```javascript
// Function called from a router.get()
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
```

## Other Notes:

I've written some explanations on how to develop larger asynchronous functions in service files. It might be better to look this up after trying to create the functions first.

### Creating multiple tables in one function

Since we have a lot of normalized entities, it might be better to understand how you can create multiple tables in one go. You probably can just look up how to do it.

```javascript
async function initiateOwners() {
  // Add the tables you want to create.
  const createTableQueries = [
    "R_1 (ID SERIAL PRIMARY KEY, a VARCHAR(255))",
    "R_2 (ID INTEGER PRIMARY KEY, b VARCHAR(255) NOT NULL, FOREIGN KEY (ID) REFERENCES R_1 (ID))",
    "R_3 (a VARCHAR(255) PRIMARY KEY, c VARCHAR(255) UNIQUE, FOREIGN KEY (a) REFERENCES R_1 (a) ON DELETE CASCADE ON UPDATE CASCADE)",
  ];

  // Add the table names tht should be dropped. Should be the same tables on createTableQueries.
  const dropTables = ["R_3", "R_2", "R_1"]; // Make sure the order is Dependent->Source. Remove tables that depends on another table first.

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
```

You can also probably just copy this template and edit it a bit for the queries you need.

### PostgreSQL Begin, Commits, and Rollbacks

Here is when you are creating compound statements. I firstly used this for multiple insertion statements for normalized tables. Imagine something like this:

```sql
INSERT INTO R_1
INSERT INTO R_2
INSERT INTO R_3
```

It might be better (or you need to) insert something in a compound manner because of the foreign key dependencies. This is where we can use transactions, commits, and rollbacks.

A high-level explanation would be like this:

```javascript
async function insertToR(a, b, c) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const R_1InsertQuery = "INSERT INTO R_1 (a) VALUES ($1) RETURNING ID"; // RETURNING ID gets the ID for R_1 to use. Do this if needed.
    const R_1InsertValues = [a];
    const R_1Result = await client.query(R_1InsertQuery, R_1InsertValues);
    const ID = R_1Result.rows[0].ID;

    const R_2InsertQuery = "INSERT INTO R_2 (ID, b) VALUES ($1, $2)";
    const R_2InsertValues = [ID, a];
    await client.query(R_2InsertQuery, R_2InsertValues);

    const R_3InsertQuery = "INSERT INTO R_3 (a, c) VALUES ($1, $2)";
    const R_3InsertValues = [a, c];
    await client.query(R_3InsertQuery, R_3InsertValues);

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
```

There might be issues depending on how the dependencies are created. We can probably fix it together along the way :smiley:
