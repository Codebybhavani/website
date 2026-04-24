const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../db');

// SIGNUP
router.post('/signup', async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    try {
        const pool = await poolPromise;

        const check = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT email FROM Users WHERE email=@email');

        if (check.recordset.length > 0) {
            return res.json({ success: false, message: 'Email already exists' });
        }

        const hashed = await bcrypt.hash(password, 10);

        await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('phone', sql.VarChar, phone)
            .input('password', sql.VarChar, hashed)
            .input('role', sql.VarChar, role)
            .query(`
                INSERT INTO Users (name, email, phone, password, role)
                VALUES (@name, @email, @phone, @password, @role)
            `);

        const user = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email=@email');

        res.json({ success: true, user: user.recordset[0] });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email=@email');

        const user = result.recordset[0];

        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ success: true, user });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

module.exports = router;