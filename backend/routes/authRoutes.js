import express from 'express';
import sequelize from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const router = express.Router();

// Middleware to validate signup data
const validateSignupData = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    req.validatedData = { name, email, password };
    next();
};

// Signup route
router.post('/signup', validateSignupData, async (req, res) => {
    const { name, email, password } = req.validatedData;
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const existingUsers = await sequelize.query(
            'SELECT email FROM users WHERE email = ?',
            {
                replacements: [email.trim().toLowerCase()],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        if (existingUsers.length > 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await sequelize.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            {
                replacements: [name, email.trim().toLowerCase(), hashedPassword],
                type: sequelize.QueryTypes.INSERT,
                transaction,
            }
        );

        const [lastUser] = await sequelize.query('SELECT LAST_INSERT_ID() as id', {
            type: sequelize.QueryTypes.SELECT,
            transaction,
        });

        await transaction.commit();

        const token = jwt.sign(
            { userId: lastUser.id, name, email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Signup successful', token, userId: lastUser.id });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error during signup', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const users = await sequelize.query('SELECT * FROM users WHERE email = ?', {
            replacements: [email.trim().toLowerCase()],
            type: sequelize.QueryTypes.SELECT,
        });

        if (!users.length) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

// Profile endpoint
router.get('/user/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const users = await sequelize.query('SELECT id, name, email FROM users WHERE email = ?', {
            replacements: [email.trim().toLowerCase()],
            type: sequelize.QueryTypes.SELECT,
        });

        if (!users.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Booking history (placeholder)
router.get('/user/bookings', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const users = await sequelize.query('SELECT id FROM users WHERE email = ?', {
            replacements: [email.trim().toLowerCase()],
            type: sequelize.QueryTypes.SELECT,
        });

        if (!users.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bookings = [
            { type: 'Flight', name: 'Delhi to Mumbai', price: 5000 },
            { type: 'Hotel', name: 'Taj Hotel', price: 3000 },
        ];

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Bookings fetch error:', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

export default router;
