const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIC: Security & Best Practices
// 1. Password Hashing: Use bcrypt to prevent storing plain text.
// 2. Input Validation: Check for required fields (can be expanded with Joi/Express-validator).
// 3. Environment Variables: Use secret keys for JWT from .env.

exports.register = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if user exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const newUser = await db.query(
            "INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, 'User') RETURNING id, full_name, email, role",
            [fullName, email, hashedPassword]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
