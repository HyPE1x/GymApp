const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.js');
const validInfo = require("../middleware/validInfo.js");
const authorization = require("../middleware/authCheck.js");

// /auth/register (Post new user)
router.post('/register', authController.register);

// /auth/login (Post user login)
router.post('/login', validInfo, authController.login);

// /auth/verify (Get token verification)
router.get("/verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error"); 
    }
});

module.exports = router;