const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { randomUUID } = require('crypto');
const db = require('./db');
const http = require("http");
const express = require('express');
const { timeEnd, timeLog } = require('console');
const { use } = require('bcrypt/promises');
const { json } = require('stream/consumers');
const app = express();
app.use(cors());
app.use(express.json());

// Destination API
app.get('/api/destination', async (req, res) => {
    const destination = req.query.query;

    if (!destination) {
        return res.status(400).json({
            error: 'Destination is required'
        });
    }

    try {
        const dbResult = await db.query(
            `SELECT name FROM destination
            WHERE LOWER(name) = LOWER($1)`,
            [destination.trim()]
        );

        // 2. Stop if the destination is not found
        if (dbResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Destination not found in our database'
            });
        }

        // Use the name stored in the database
        const destinationName = dbResult.rows[0].name;
        // Fetch data from Unsplash and Wikipedia simultaneously
        const [unsplashResponse, wikiResponse] = await Promise.all([
            fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destinationName)}&per_page=1`,
                {
                    headers: {
                        Authorization: `Client-ID ${process.env.access_key}`
                    }
                }
            ),

            fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destinationName)}`
            )
        ]);

        // Check API responses
        if (!unsplashResponse.ok) {
            return res.status(502).json({
                error: 'Unsplash request failed'
            });
        }

        if (!wikiResponse.ok) {
            return res.status(502).json({
                error: 'Wikipedia request failed'
            });
        }

        // Convert responses to JSON
        const [unsplashData, wikiData] = await Promise.all([
            unsplashResponse.json(),
            wikiResponse.json()
        ]);

        // Send combined response
        return res.status(200).json({
            destination,
            photos: unsplashData.results,
            information: {
                title: wikiData.title,
                description: wikiData.extract,
                url: wikiData.content_urls?.desktop?.page
            }
        });

    } catch (error) {
        console.error('Destination API error:', error);

        return res.status(500).json({
            error: 'Failed to fetch destination information'
        });
    }
});

// signup
app.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, contact, email, pass } = req.body;

        // Generate UUID
        const id = randomUUID();

        // password hashed
        const hashPass = await bcrypt.hash(pass, 12);

        const insert_query = `
            INSERT INTO customer
                (id, first_name, last_name, contact, email,
                password, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        `;

        const values = [
            id,
            firstname,
            lastname,
            contact,
            email,
            hashPass,
            'true'
        ];

        await db.query(insert_query, values);

        console.log('Signup successfully');
        return res.status(201).json({
            message: 'Signup successful',
            id: id
        });

    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({
            error: 'Signup failed'
        });
    }
});

// login
app.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;
        const login_query = `select id,first_name,last_name,email,password,status
                            from customer where email = $1`;

        const result = await db.query(login_query, [email]);
        if (!result.rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid Email or Password'
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(
            pass,
            user.password
        );

        if (!isMatch || user.status === false) {
            return res.status(401).json({
                message: 'Invalid Email or Password'
            });
        }

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                firstname: user.first_name,
                lastname: user.last_name,
            }
        });
    } catch (error) {
        console.log("Error", error);
        res.status(500), json({
            message: 'something went wrong'
        });
    }
});

app.listen(3000, () => {
    console.log('Express server running at http://localhost:3000');
});