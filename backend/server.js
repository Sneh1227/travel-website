const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { randomUUID } = require('crypto');
const db = require('./db');
const http = require("http");
const express = require('express');
const { timeEnd, timeLog } = require('console');
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
        // Fetch data from Unsplash and Wikipedia simultaneously
        const [unsplashResponse, wikiResponse] = await Promise.all([
            fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&per_page=1`,
                {
                    headers: {
                        Authorization: `Client-ID ${process.env.access_key}`
                    }
                }
            ),

            fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination)}`
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

app.listen(3000, () => {
    console.log('Express server running at http://localhost:3000');
});