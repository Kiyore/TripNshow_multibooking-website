import Package from '../models/Package.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    console.log('Fetched packages:', packages);
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
};

export const searchPackages = async (req, res) => {
  const { location } = req.query;
  let queryOptions = { where: {} };

  if (location) {
    queryOptions.where.location = { [Op.like]: `%${location}%` };
  }

  try {
    const packages = await Package.findAll(queryOptions);
    console.log('Search results:', packages);
    res.json(packages);
  } catch (error) {
    console.error('Error searching packages:', error);
    res.status(500).json({ message: 'Error searching packages', error: error.message });
  }
};

export const bookPackage = async (req, res) => {
  const { packageId } = req.body;
  if (!packageId) {
    return res.status(400).json({ message: 'packageId is required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId) VALUES (1, "package", ?)', {
      replacements: [packageId]
    });
    res.json({ message: 'Package booked successfully' });
  } catch (error) {
    console.error('Error booking package:', error);
    res.status(500).json({ message: 'Error booking package', error: error.message });
  }
};

export const createPackage = async (req, res) => {
  const { title, description, location, start_date, end_date, price, slots_available } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!title || !description || !location || !start_date || !end_date || !price || !slots_available) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await Package.create({
      title,
      description,
      location,
      start_date,
      end_date,
      price,
      slots_available,
      image_path: imagePath
    });
    res.json({ message: 'Package created successfully' });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ message: 'Error creating package', error: error.message });
  }
};