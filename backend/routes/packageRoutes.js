import express from 'express';
import Package from '../models/Package.js';
import sequelize from '../config/db.js';

const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific package by ID
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(pkg);
  } catch (error) {
    console.error('Error fetching package by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book a package
router.post('/book', async (req, res) => {
  const { packageId, userId, noSlots } = req.body;
  if (!packageId || !userId || !noSlots) {
    return res.status(400).json({ message: 'packageId, userId, and noSlots are required' });
  }
  try {
    await sequelize.query('INSERT INTO bookings (userId, type, itemId, no_tickets) VALUES (?, "package", ?, ?)', {
      replacements: [userId, packageId, noSlots]
    });
    res.json({ message: 'Package booked successfully' });
  } catch (error) {
    console.error('Error booking package:', error);
    res.status(500).json({ message: 'Error booking package', error: error.message });
  }
});

export default router;