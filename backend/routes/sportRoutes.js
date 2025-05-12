import express from 'express';
import Sport from '../models/Sport.js';
import sequelize from '../config/db.js';

const router = express.Router();

// Get all sports events
router.get('/', async (req, res) => {
  try {
    const sports = await Sport.findAll();
    res.json(sports);
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific sport event by ID
router.get('/:id', async (req, res) => {
  try {
    const sport = await Sport.findByPk(req.params.id);
    if (!sport) {
      return res.status(404).json({ message: 'Sport event not found' });
    }
    res.json(sport);
  } catch (error) {
    console.error('Error fetching sport by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book a sport event
router.post('/book', async (req, res) => {
  const { sportId, userId, noTickets } = req.body;
  if (!sportId || !userId || !noTickets) {
    return res.status(400).json({ message: 'sportId, userId, and noTickets are required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId, no_tickets) VALUES (?, "sports", ?, ?)', {
      replacements: [userId, sportId, noTickets]
    });
    res.json({ message: 'Sport event booked successfully' });
  } catch (error) {
    console.error('Error booking sport:', error);
    res.status(500).json({ message: 'Error booking sport', error: error.message });
  }
});

export default router;