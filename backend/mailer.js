require('dotenv').config();
const nodemailer = require("nodemailer");

const user = process.env.EMAIL_USER;
const rawPass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: user,
        pass: rawPass
    }
});

module.exports = transporter;
