const pool = require('../../db.js');

// Function to get logged in user's username
async function username(user) {
    try {
        const username = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [user]);

        return username.rows[0];

    } catch (error) {
        console.error("Database Error:", err.message);
        return {status: "error", message: err.message }
    }
}


module.exports = {
    username
};