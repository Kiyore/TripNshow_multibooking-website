import express from 'express';
import Cab from '../models/Cab.js';
import sequelize from '../config/db.js';

const router = express.Router();

// Get all cabs
router.get('/', async (req, res) => {
  try {
    const cabs = await Cab.findAll();
    res.json(cabs);
  } catch (error) {
    console.error('Error fetching cabs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific cab by ID
router.get('/:id', async (req, res) => {
  try {
    const cab = await Cab.findByPk(req.params.id);
    if (!cab) {
      return res.status(404).json({ message: 'Cab not found' });
    }
    res.json(cab);
  } catch (error) {
    console.error('Error fetching cab by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book a cab
router.post('/book', async (req, res) => {
  const { cabId, userId, noSeats } = req.body;
  if (!cabId || !userId || !noSeats) {
    return res.status(400).json({ message: 'cabId, userId, and noSeats are required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId, no_tickets) VALUES (?, "cab", ?, ?)', {
      replacements: [userId, cabId, noSeats]
    });
    res.json({ message: 'Cab booked successfully' });
  } catch (error) {
    console.error('Error booking cab:', error);
    res.status(500).json({ message: 'Error booking cab', error: error.message });
  }
});

export default router;