import express from 'express';
import User from '../models/User.js';
import sequelize from '../config/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// GET all users (for admin or testing)
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST to create a new user (for admin use or testing, no password)
router.post('/create', async (req, res) => {
    const { name, email, mobile, dob } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    try {
        // Check if email already exists
        const [existingUsers] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
            replacements: [email]
        });
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert user with default wallet and unverified status
        const [result] = await sequelize.query(
            'INSERT INTO users (name, email, mobile, dob, is_verified, wallet) VALUES (?, ?, ?, ?, 0, 200000.00)',
            { replacements: [name, email, mobile || null, dob || null] }
        );

        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// PUT to update user wallet balance
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { wallet } = req.body;

    if (wallet === undefined || isNaN(wallet)) {
        return res.status(400).json({ message: 'Valid wallet amount is required' });
    }

    try {
        const [updated] = await sequelize.query(
            'UPDATE users SET wallet = ? WHERE id = ?',
            { replacements: [wallet, id] }
        );
        if (updated[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Wallet updated successfully' });
    } catch (error) {
        console.error('Error updating wallet:', error);
        res.status(500).json({ message: 'Error updating wallet', error: error.message });
    }
});

// GET user profile (authenticated)
router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await sequelize.query('SELECT id, name, email, wallet FROM users WHERE id = ?', {
            replacements: [decoded.userId]
        });
        if (!users.length) return res.status(404).json({ message: 'User not found' });
        res.json(users[0]);
    } catch (error) {
        console.error('Error verifying token or fetching profile:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// GET booking history (authenticated, placeholder)
router.get('/bookings', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Placeholder: Replace with actual booking logic (e.g., query a bookings table)
        // For now, return an empty array
        res.json([]);
    } catch (error) {
        console.error('Error verifying token or fetching bookings:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default router;