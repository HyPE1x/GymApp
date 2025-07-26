const auth_db = require('../db/auth.js');


//register route controller
async function register(req, res) {
    try {
        const {username, email, password} = req.body;
        const results = await auth_db.register({username, email, password});
        if(results === "email already exists") {
            res.status(401).json("A user with this email already exists");
        }
        if(results === "username already exists") {
            res.status(401).json("This username is already taken");
        }
        if(results.status === "registered") {
            res.status(200).json({message: "Successfully registed new user", newUser: results.user, token: results.token});
        }
        if(results.status === "error") {
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.log(error);
    }
}

//login route controller
async function login(req, res) {
    try {
        const {email, password} = req.body;
        const results = await auth_db.login({email, password});

        if(results === "invalid email" || results === "invalid password") {
            res.status(401).json("Email or Password do not match");
        }
        if(results.status === "error") {
            res.status(500).json({ message: "Database error", error: results.message });
        }
        if(results.status === "logged in") {
            res.status(200).json({message: "Successfully logged in", user: results.user, token: results.token});
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    register,
    login
};