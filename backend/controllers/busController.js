import Bus from './models/bus.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.findAll();
    console.log('Fetched buses:', buses);
    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Error fetching buses', error: error.message });
  }
};

export const searchBuses = async (req, res) => {
  const { source } = req.query;
  let queryOptions = { where: {} };

  if (source) {
    queryOptions.where.source = { [Op.like]: `%${source}%` };
  }

  try {
    const buses = await Bus.findAll(queryOptions);
    console.log('Search results:', buses);
    res.json(buses);
  } catch (error) {
    console.error('Error searching buses:', error);
    res.status(500).json({ message: 'Error searching buses', error: error.message });
  }
};

export const bookBus = async (req, res) => {
  const { busId } = req.body;
  if (!busId) {
    return res.status(400).json({ message: 'busId is required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId) VALUES (1, "bus", ?)', {
      replacements: [busId]
    });
    res.json({ message: 'Bus booked successfully' });
  } catch (error) {
    console.error('Error booking bus:', error);
    res.status(500).json({ message: 'Error booking bus', error: error.message });
  }
};

export const createBus = async (req, res) => {
  const { bus_name, source, destination, departure_time, arrival_time, price, seats_available } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!bus_name || !source || !destination || !departure_time || !arrival_time || !price || !seats_available) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await Bus.create({
      bus_name,
      source,
      destination,
      departure_time,
      arrival_time,
      price,
      seats_available,
      image_path: imagePath
    });
    res.json({ message: 'Bus created successfully' });
  } catch (error) {
    console.error('Error creating bus:', error);
    res.status(500).json({ message: 'Error creating bus', error: error.message });
  }
};