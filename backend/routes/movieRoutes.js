import express from 'express';
import Movie from '../models/Movie.js';
import sequelize from '../config/db.js';

const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book a movie
router.post('/book', async (req, res) => {
  const { movieId, userId, noTickets } = req.body;
  if (!movieId || !userId || !noTickets) {
    return res.status(400).json({ message: 'movieId, userId, and noTickets are required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId, no_tickets) VALUES (?, "movie", ?, ?)', {
      replacements: [userId, movieId, noTickets]
    });
    res.json({ message: 'Movie booked successfully' });
  } catch (error) {
    console.error('Error booking movie:', error);
    res.status(500).json({ message: 'Error booking movie', error: error.message });
  }
});

export default router;