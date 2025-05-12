import Sport from '../models/Sport.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

export const getSports = async (req, res) => {
  try {
    const sports = await Sport.findAll();
    console.log('Fetched sports:', sports);
    res.json(sports);
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({ message: 'Error fetching sports', error: error.message });
  }
};

export const searchSports = async (req, res) => {
  const { venue } = req.query;
  let queryOptions = { where: {} };

  if (venue) {
    queryOptions.where.venue = { [Op.like]: `%${venue}%` };
  }

  try {
    const sports = await Sport.findAll(queryOptions);
    console.log('Search results:', sports);
    res.json(sports);
  } catch (error) {
    console.error('Error searching sports:', error);
    res.status(500).json({ message: 'Error searching sports', error: error.message });
  }
};

export const bookSport = async (req, res) => {
  const { sportId } = req.body;
  if (!sportId) {
    return res.status(400).json({ message: 'sportId is required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId) VALUES (1, "sport", ?)', {
      replacements: [sportId]
    });
    res.json({ message: 'Sport booked successfully' });
  } catch (error) {
    console.error('Error booking sport:', error);
    res.status(500).json({ message: 'Error booking sport', error: error.message });
  }
};

export const createSport = async (req, res) => {
  const { name, team1, team2, venue, date, time, price, seats_available } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!name || !team1 || !team2 || !venue || !date || !time || !price || !seats_available) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await Sport.create({
      name,
      team1,
      team2,
      venue,
      date,
      time,
      price,
      seats_available,
      image_path: imagePath
    });
    res.json({ message: 'Sport created successfully' });
  } catch (error) {
    console.error('Error creating sport:', error);
    res.status(500).json({ message: 'Error creating sport', error: error.message });
  }
};