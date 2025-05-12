import db from '../config/db.js';

export const getCabs = (req, res) => {
  db.query('SELECT * FROM cabs', (err, results) => {
    if (err) {
      console.error('Error querying cabs:', err.message);
      return res.status(500).json({ message: 'Error fetching cabs', error: err.message });
    }
    console.log('Fetched cabs:', results);
    res.json(results);
  });
};

export const searchCabs = (req, res) => {
  const { pickup_location } = req.query;
  let query = 'SELECT * FROM cabs WHERE 1=1';
  const params = [];

  if (pickup_location) {
    query += ' AND pickup_location LIKE ?';
    params.push(`%${pickup_location}%`);
  }

  console.log('Search query:', query, 'Params:', params);

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error searching cabs:', err.message);
      return res.status(500).json({ message: 'Error searching cabs', error: err.message });
    }
    console.log('Search results:', results);
    res.json(results);
  });
};

export const bookCab = (req, res) => {
  const { cabId } = req.body;
  if (!cabId) {
    return res.status(400).json({ message: 'cabId is required' });
  }
  db.query('INSERT INTO bookings (userId, type, itemId) VALUES (1, "cab", ?)', [cabId], (err) => {
    if (err) {
      console.error('Error booking cab:', err.message);
      return res.status(500).json({ message: 'Error booking cab', error: err.message });
    }
    res.json({ message: 'Cab booked successfully' });
  });
};

export const createCab = (req, res) => {
  const { cab_type, driver_name, pickup_location, drop_location, price, seats } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!cab_type || !driver_name || !pickup_location || !drop_location || !price || !seats) {
    return res.status(400).json({ message: 'All fields (cab_type, driver_name, pickup_location, drop_location, price, seats) are required' });
  }

  db.query(
    'INSERT INTO cabs (cab_type, driver_name, pickup_location, drop_location, price, seats, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [cab_type, driver_name, pickup_location, drop_location, price, seats, imagePath],
    (err) => {
      if (err) {
        console.error('Error creating cab:', err.message);
        return res.status(500).json({ message: 'Error creating cab', error: err.message });
      }
      res.json({ message: 'Cab created successfully' });
    }
  );
};