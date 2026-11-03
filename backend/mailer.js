require('dotenv').config();
const nodemailer = require("nodemailer");

const user = (process.env.EMAIL_USER || "").replace(/^["']|["']$/g, "").trim();
const rawPass = (process.env.EMAIL_PASS || "").replace(/^["']|["']$/g, "").trim();
const pass = rawPass.replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: user,
        pass: pass
    }
});

module.exports = transporter;
