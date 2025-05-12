import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from './config/db.js';
import User from './models/User.js';
import busRoutes from './routes/busRoutes.js';
import cabRoutes from './routes/cabRoutes.js';
import concertRoutes from './routes/concertRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import sportRoutes from './routes/sportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Serve static frontend files and image assets
app.use(express.static(join(__dirname, '../frontend')));
app.use('/images', express.static(join(__dirname, 'public/images'))); // Image Fix ✅

// API Routes
app.use('/api/buses', busRoutes);
app.use('/api/cabs', cabRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', {
        message: err.message,
        stack: err.stack,
        code: err.code || 'No code'
    });
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Home route
app.get('/', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                res.redirect('/login.html');
            } else {
                res.sendFile(join(__dirname, '../frontend', 'index.html'));
            }
        } catch (error) {
            console.error('Invalid or expired token:', error.message);
            res.redirect('/login.html');
        }
    } else {
        res.redirect('/login.html');
    }
});

// Start server after DB sync
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Database synchronized successfully');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Database synchronization failed:', err.message);
        process.exit(1);
    });

// Safety: handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

export default app;
