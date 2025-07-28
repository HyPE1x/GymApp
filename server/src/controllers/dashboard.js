const dashboard_db = require('../db/dashboard.js');

async function username(req, res) {
    try {
        const user = req.user; 
        const results = await dashboard_db.username(user);

        if (results.status === "error") {
            res.status(500).json({ message: "Database error", error: results.message });
        } else {
            res.json(results);;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
    }
}

module.exports = {
    username
};