require('dotenv').config();
const { Client } = require('pg');
const express = require('express');
const app = express();

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: process.env.DB_port,
    password: process.env.DB_pass,
    database: "travel-website-DB"
});

con.connect()
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));

module.exports = con;
