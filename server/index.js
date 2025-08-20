const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/auth', require('./src/routes/auth.js')); //authentication (login, register)
app.use('/dashboard', require('./src/routes/dashboard.js')); //dashboard related routes
app.use('/routines', require('./src/routes/routines.js')); //routines related routes
app.use('/logging', require('./src/routes/logging.js')); //workout log related routes


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

