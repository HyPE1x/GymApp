const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	database: process.env.PGDB,
});

module.exports = pool;