import express from 'express';
import Hotel from '../models/Hotel.js';
import sequelize from '../config/db.js';

const router = express.Router();

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.findAll();
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book a hotel
router.post('/book', async (req, res) => {
  const { hotelId, userId, noRooms } = req.body;
  if (!hotelId || !userId || !noRooms) {
    return res.status(400).json({ message: 'hotelId, userId, and noRooms are required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId, no_tickets) VALUES (?, "hotel", ?, ?)', {
      replacements: [userId, hotelId, noRooms]
    });
    res.json({ message: 'Hotel booked successfully' });
  } catch (error) {
    console.error('Error booking hotel:', error);
    res.status(500).json({ message: 'Error booking hotel', error: error.message });
  }
});

export default router;