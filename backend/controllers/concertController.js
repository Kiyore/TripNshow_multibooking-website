import Concert from '../models/Concert.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

export const getConcerts = async (req, res) => {
  try {
    const concerts = await Concert.findAll();
    console.log('Fetched concerts:', concerts);
    res.json(concerts);
  } catch (error) {
    console.error('Error fetching concerts:', error);
    res.status(500).json({ message: 'Error fetching concerts', error: error.message });
  }
};

export const searchConcerts = async (req, res) => {
  const { location } = req.query;
  let queryOptions = { where: {} };

  if (location) {
    queryOptions.where.location = { [Op.like]: `%${location}%` };
  }

  try {
    const concerts = await Concert.findAll(queryOptions);
    console.log('Search results:', concerts);
    res.json(concerts);
  } catch (error) {
    console.error('Error searching concerts:', error);
    res.status(500).json({ message: 'Error searching concerts', error: error.message });
  }
};

export const bookConcert = async (req, res) => {
  const { concertId } = req.body;
  if (!concertId) {
    return res.status(400).json({ message: 'concertId is required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId) VALUES (1, "concert", ?)', {
      replacements: [concertId]
    });
    res.json({ message: 'Concert booked successfully' });
  } catch (error) {
    console.error('Error booking concert:', error);
    res.status(500).json({ message: 'Error booking concert', error: error.message });
  }
};

export const createConcert = async (req, res) => {
  const { name, artist, location, date, time, price, seats_available } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!name || !artist || !location || !date || !time || !price || !seats_available) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await Concert.create({
      name,
      artist,
      location,
      date,
      time,
      price,
      seats_available,
      image_path: imagePath
    });
    res.json({ message: 'Concert created successfully' });
  } catch (error) {
    console.error('Error creating concert:', error);
    res.status(500).json({ message: 'Error creating concert', error: error.message });
  }
};