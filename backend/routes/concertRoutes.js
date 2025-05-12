import express from 'express';
import Concert from '../models/Concert.js';
import sequelize from '../config/db.js';

const router = express.Router();

// Get all concerts
router.get('/', async (req, res) => {
  try {
    const concerts = await Concert.findAll();
    res.json(concerts);
  } catch (error) {
    console.error('Error fetching concerts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific concert by ID
router.get('/:id', async (req, res) => {
  try {
    const concert = await Concert.findByPk(req.params.id);
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }
    res.json(concert);
  } catch (error) {
    console.error('Error fetching concert by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book a concert
router.post('/book', async (req, res) => {
  const { concertId, userId, noTickets } = req.body;
  if (!concertId || !userId || !noTickets) {
    return res.status(400).json({ message: 'concertId, userId, and noTickets are required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId, no_tickets) VALUES (?, "concert", ?, ?)', {
      replacements: [userId, concertId, noTickets]
    });
    res.json({ message: 'Concert booked successfully' });
  } catch (error) {
    console.error('Error booking concert:', error);
    res.status(500).json({ message: 'Error booking concert', error: error.message });
  }
});

export default router;