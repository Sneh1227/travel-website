
require("dotenv").config();

const { Pool } = require("pg");

const db = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false
});

db.on("error", (err) => {
    console.error("Unexpected database error:", err);
});

module.exports = db;
