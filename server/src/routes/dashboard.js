const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.js');
const authorization = require("../middleware/authCheck.js");

// /dashboard/username (Get user's username)
router.get('/username', authorization, dashboardController.username);

// /dashboard/userid (Get user's userID)
router.get("/userid", authorization, async(req, res) => {
    try {
        res.json({ userID: req.user });
    } catch (err) {
        console.log(err.message);
    }
})


module.exports = router;