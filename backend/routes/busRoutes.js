import express from 'express';
import Bus from '../models/Bus.js';
import sequelize from '../config/db.js';

const router = express.Router();

// Get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.findAll();
    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific bus by ID
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    console.error('Error fetching bus by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book a bus
router.post('/book', async (req, res) => {
  const { busId, userId, noSeats } = req.body;
  if (!busId || !userId || !noSeats) {
    return res.status(400).json({ message: 'busId, userId, and noSeats are required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId, no_tickets) VALUES (?, "bus", ?, ?)', {
      replacements: [userId, busId, noSeats]
    });
    res.json({ message: 'Bus booked successfully' });
  } catch (error) {
    console.error('Error booking bus:', error);
    res.status(500).json({ message: 'Error booking bus', error: error.message });
  }
});

export default router;