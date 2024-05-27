import pool from "./databaseService.js";

async function fetchAllFriendPosts() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM friendpost");
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching friend posts from the database:", error);
    throw error;
  }
}

export { fetchAllFriendPosts };
