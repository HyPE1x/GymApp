const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",")
  : ["http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
}));

app.use(express.json());

//Routes
app.use('/auth', require('./src/routes/auth.js')); //authentication (login, register)
app.use('/dashboard', require('./src/routes/dashboard.js')); //dashboard related routes
app.use('/routines', require('./src/routes/routines.js')); //routines related routes
app.use('/logging', require('./src/routes/logging.js')); //workout log related routes


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

