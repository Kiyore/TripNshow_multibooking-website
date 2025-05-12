import Movie from '../models/Movie.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    console.log('Fetched movies:', movies);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

export const searchMovies = async (req, res) => {
  const { cinema_hall } = req.query;
  let queryOptions = { where: {} };

  if (cinema_hall) {
    queryOptions.where.cinema_hall = { [Op.like]: `%${cinema_hall}%` };
  }

  try {
    const movies = await Movie.findAll(queryOptions);
    console.log('Search results:', movies);
    res.json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Error searching movies', error: error.message });
  }
};

export const bookMovie = async (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ message: 'movieId is required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId) VALUES (1, "movie", ?)', {
      replacements: [movieId]
    });
    res.json({ message: 'Movie booked successfully' });
  } catch (error) {
    console.error('Error booking movie:', error);
    res.status(500).json({ message: 'Error booking movie', error: error.message });
  }
};

export const createMovie = async (req, res) => {
  const { title, language, genre, cinema_hall, show_date, show_time, price, seats_available } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!title || !language || !genre || !cinema_hall || !show_date || !show_time || !price || !seats_available) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await Movie.create({
      title,
      language,
      genre,
      cinema_hall,
      show_date,
      show_time,
      price,
      seats_available,
      image_path: imagePath
    });
    res.json({ message: 'Movie created successfully' });
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Error creating movie', error: error.message });
  }
};