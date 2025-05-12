import express from 'express';
import Flight from '../models/Flight.js';
import sequelize from '../config/db.js';

const router = express.Router();

// Get all flights
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.findAll();
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific flight by ID
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book a flight
router.post('/book', async (req, res) => {
  const { flightId, userId, noTickets } = req.body;
  if (!flightId || !userId || !noTickets) {
    return res.status(400).json({ message: 'flightId, userId, and noTickets are required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId, no_tickets) VALUES (?, "flight", ?, ?)', {
      replacements: [userId, flightId, noTickets]
    });
    res.json({ message: 'Flight booked successfully' });
  } catch (error) {
    console.error('Error booking flight:', error);
    res.status(500).json({ message: 'Error booking flight', error: error.message });
  }
});

export default router;