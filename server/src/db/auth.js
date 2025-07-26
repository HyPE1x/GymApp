const pool = require('../../db.js');
const bcrypt = require("bcrypt");
const jwtGen = require('../../utils/jwtGen.js');

// register route function
async function register(params) {
    try {
        const { username, email, password } = params;

        //Check if email already in database
        const checkDupeEmail = await pool.query("SELECT * FROM users WHERE LOWER(user_email) = LOWER($1)", [
            email
        ]);
        if(checkDupeEmail.rows.length !== 0){
            return "email already exists";
        }

        //check if username already in database
        const checkDupeName = await pool.query("SELECT * FROM users WHERE LOWER(user_name) = LOWER($1)", [
            username
        ]);
        if(checkDupeName.rows.length !== 0){
            return "username already exists";
        }

        //encrypt user password
        const bcryptPassword = await bcrypt.hash(password, 10);

        //insert new user into database
        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", 
            [username, email, bcryptPassword]
        );
        
        //generate JWT token
        const token = jwtGen(newUser.rows[0].user_id);
        return {status: "registered", user: newUser.rows[0], token: token};

    } catch (err) {
        console.error("Database Error:", err.message);
        return {status: "error", message: err.message };
    }
}

//login route function
async function login(params) {
    try {
        const {email, password} = params;

        //check if user exists
        const user = await pool.query("SELECT * FROM users where user_email = $1", 
            [email]
        );
        if(user.rows.length === 0) {
            return "invalid email";
        }

        //check if password is correct
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        if(!validPassword){
            return "invalid password";
        }

        //give jwt token
        const token = jwtGen(user.rows[0].user_id);
        return {status: "logged in", user: user.rows[0], token: token};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

module.exports = {
    register, 
    login,
};

