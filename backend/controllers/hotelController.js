import Hotel from '../models/Hotel.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.findAll();
    console.log('Fetched hotels:', hotels);
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Error fetching hotels', error: error.message });
  }
};

export const searchHotels = async (req, res) => {
  const { location } = req.query;
  let queryOptions = { where: {} };

  if (location) {
    queryOptions.where.location = { [Op.like]: `%${location}%` };
  }

  try {
    const hotels = await Hotel.findAll(queryOptions);
    console.log('Search results:', hotels);
    res.json(hotels);
  } catch (error) {
    console.error('Error searching hotels:', error);
    res.status(500).json({ message: 'Error searching hotels', error: error.message });
  }
};

export const bookHotel = async (req, res) => {
  const { hotelId } = req.body;
  if (!hotelId) {
    return res.status(400).json({ message: 'hotelId is required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId) VALUES (1, "hotel", ?)', {
      replacements: [hotelId]
    });
    res.json({ message: 'Hotel booked successfully' });
  } catch (error) {
    console.error('Error booking hotel:', error);
    res.status(500).json({ message: 'Error booking hotel', error: error.message });
  }
};

export const createHotel = async (req, res) => {
  const { name, location, check_in, check_out, room_type, price_per_night, rooms_available } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!name || !location || !check_in || !check_out || !room_type || !price_per_night || !rooms_available) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await Hotel.create({
      name,
      location,
      check_in,
      check_out,
      room_type,
      price_per_night,
      rooms_available,
      image_path: imagePath
    });
    res.json({ message: 'Hotel created successfully' });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ message: 'Error creating hotel', error: error.message });
  }
};