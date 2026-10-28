const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { randomUUID } = require('crypto');
const db = require('./db');
const jwt = require("jsonwebtoken");
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
            `SELECT * FROM destination
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
        const id = dbResult.rows[0].id;
        const destinationName = dbResult.rows[0].name;
        const price = dbResult.rows[0].price;
        const days = dbResult.rows[0].days;
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
            id: id,
            photos: unsplashData.results,
            price: price,
            days: days,
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

        const check = `select * from customer where email = $1`;
        const data = await db.query(check, [email])
        if (data.rows.length > 0) {
            return res.status(409).json({
                message: 'Email already registered. Please login.'
            });
        }

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

        // Create a signed JWT containing the customer ID
        const token = jwt.sign(
            { customerId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token,
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

// booking a trip
app.post('/bookatrip', authenticateToken, async (req, res) => {
    try {
        // Get the customer ID from the verified token
        const customerId = req.user.customerId;
        const { destinationid, date, totalPerson, totalCost } = req.body;

        const id = randomUUID();
        const booking_query = `insert into booking (id,travel_date,total_person,
                                total_cost,created_at,updated_at,customer_id,
                                destination_id) values ($1,$2,$3,$4,now(),now(),$5,$6)`;

        const values = [
            id,
            date,
            totalPerson,
            totalCost,
            customerId,
            destinationid
        ]
        await db.query(booking_query, values);
        console.log('booking successfully');
        return res.status(201).json({
            message: 'Booking successfull',
            bookingId: id
        });
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({
            message: error.message
        });
    }
});

// Fetch bookings for logged in user
app.get('/mybookings', authenticateToken, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const query = `
            SELECT 
                b.id,
                b.travel_date,
                b.total_person,
                b.total_cost,
                b.created_at,
                b.destination_id,
                d.name AS destination_name,
                d.price AS destination_price,
                d.days AS destination_days
            FROM booking b
            LEFT JOIN destination d ON b.destination_id = d.id
            WHERE b.customer_id = $1
            ORDER BY b.created_at DESC
        `;
        const result = await db.query(query, [customerId]);
        return res.status(200).json({
            message: 'Bookings fetched successfully',
            bookings: result.rows
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({
            message: 'Failed to fetch bookings'
        });
    }
});

// Cancel a booking
app.delete('/cancel-booking/:id', authenticateToken, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const bookingId = req.params.id;

        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        const deleteQuery = `
            DELETE FROM booking 
            WHERE id = $1 AND customer_id = $2 
            RETURNING id
        `;
        const result = await db.query(deleteQuery, [bookingId, customerId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Booking not found or not authorized to cancel'
            });
        }

        console.log(`Booking ${bookingId} cancelled by customer ${customerId}`);
        return res.status(200).json({
            message: 'Booking cancelled successfully',
            cancelledId: result.rows[0].id
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return res.status(500).json({
            message: 'Failed to cancel booking'
        });
    }
});

// Add or update testimonial for a destination
app.post('/testimonial', authenticateToken, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const { destination_id, ratings, comment } = req.body;

        if (!destination_id) {
            return res.status(400).json({ message: 'Destination ID is required' });
        }

        const numericRating = Number(ratings);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
        }

        const cleanComment = (comment || '').trim();
        if (!cleanComment) {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }

        // Check if customer already submitted a testimonial for this destination
        const existingCheck = await db.query(
            `SELECT id FROM testimonials WHERE customer_id = $1 AND destination_id = $2`,
            [customerId, destination_id]
        );

        let testimonialId;
        if (existingCheck.rows.length > 0) {
            testimonialId = existingCheck.rows[0].id;
            const updateQuery = `
                UPDATE testimonials 
                SET ratings = $1, comment = $2, updated_at = NOW() 
                WHERE id = $3 
                RETURNING id, ratings, comment, created_at, updated_at, customer_id AS customer_id, destination_id
            `;
            const updateResult = await db.query(updateQuery, [numericRating, cleanComment, testimonialId]);
            return res.status(200).json({
                message: 'Testimonial updated successfully',
                testimonial: updateResult.rows[0]
            });
        } else {
            testimonialId = randomUUID();
            const insertQuery = `
                INSERT INTO testimonials 
                    (id, ratings, comment, created_at, updated_at, customer_id, destination_id)
                VALUES ($1, $2, $3, NOW(), NOW(), $4, $5)
                RETURNING id, ratings, comment, created_at, updated_at, customer_id AS customer_id, destination_id
            `;
            const insertResult = await db.query(insertQuery, [
                testimonialId,
                numericRating,
                cleanComment,
                customerId,
                destination_id
            ]);
            return res.status(201).json({
                message: 'Testimonial submitted successfully',
                testimonial: insertResult.rows[0]
            });
        }
    } catch (error) {
        console.error('Error submitting testimonial:', error);
        return res.status(500).json({
            message: 'Failed to submit testimonial: ' + (error.message || 'Database error')
        });
    }
});

// Fetch all testimonials for the logged-in customer
app.get('/my-testimonials', authenticateToken, async (req, res) => {
    try {
        const customerId = req.user.customerId;

        const query = `
            SELECT 
                t.id,
                t.ratings,
                t.comment,
                t.created_at,
                t.updated_at,
                t.destination_id,
                d.name AS destination_name
            FROM testimonials t
            LEFT JOIN destination d ON t.destination_id = d.id
            WHERE t.customer_id = $1
            ORDER BY t.created_at DESC
        `;
        const result = await db.query(query, [customerId]);
        return res.status(200).json({
            message: 'Testimonials fetched successfully',
            testimonials: result.rows
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return res.status(500).json({
            message: 'Failed to fetch testimonials'
        });
    }
});

// Fetch all testimonials from database
app.get('/api/testimonials', async (req, res) => {
    try {
        const query = `
            SELECT 
                t.id,
                t.ratings,
                t.comment,
                t.created_at,
                t.updated_at,
                t.destination_id,
                c.first_name,
                c.last_name,
                d.name AS destination_name
            FROM testimonials t
            LEFT JOIN customer c ON t.customer_id = c.id
            LEFT JOIN destination d ON t.destination_id = d.id where t.ratings >4
            ORDER BY t.created_at DESC
        `;
        const result = await db.query(query);
        return res.status(200).json({
            message: 'Testimonials fetched successfully',
            testimonials: result.rows
        });
    } catch (error) {
        console.error('Error fetching public testimonials:', error);
        return res.status(500).json({
            message: 'Failed to fetch testimonials'
        });
    }
});

app.get('/testimonials', (req, res) => {
    res.redirect('/api/testimonials');
});

// Change user password
app.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const currentPassword = req.body.currentPassword || req.body.oldPassword || req.body.oldpass;
        const newPassword = req.body.newPassword || req.body.newpass;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'New password must be at least 8 characters long'
            });
        }

        const userResult = await db.query(
            `SELECT id, password FROM customer WHERE id = $1`,
            [customerId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Current password is incorrect'
            });
        }

        const hashPass = await bcrypt.hash(newPassword, 12);
        await db.query(
            `UPDATE customer SET password = $1, updated_at = NOW() WHERE id = $2`,
            [hashPass, customerId]
        );

        console.log('Password updated successfully');
        return res.status(200).json({
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({
            message: 'Failed to change password'
        });
    }
});

// Get user profile info
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const customerId = req.user.customerId;
        const query = `
            SELECT id, first_name, last_name, contact, email, created_at
            FROM customer
            WHERE id = $1
        `;
        const result = await db.query(query, [customerId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({
            message: 'Failed to fetch profile'
        });
    }
});

app.listen(3000, () => {
    console.log('Express server running at http://localhost:3000');
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Please log in first'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token. Please log in again.'
        });
    }
}
