import db from '../config/db.js';


export const getFlights = (req, res) => {
    db.query('SELECT * FROM flights', (err, results) => {
        if (err) {
            console.error('Error querying flights:', err.message);
            return res.status(500).json({ message: 'Error fetching flights', error: err.message });
        }
        console.log('Fetched flights:', results); // Debug log
        res.json(results);
    });
};

export const searchFlights = (req, res) => {
    const { source, destination } = req.query;
    let query = 'SELECT * FROM flights WHERE 1=1'; // Dynamic query builder
    const params = [];

    if (source) {
        query += ' AND source LIKE ?';
        params.push(`%${source}%`);
    }
    if (destination) {
        query += ' AND destination LIKE ?';
        params.push(`%${destination}%`);
    }

    console.log('Search query:', query, 'Params:', params); // Debug log

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error searching flights:', err.message);
            return res.status(500).json({ message: 'Error searching flights', error: err.message });
        }
        console.log('Search results:', results); // Debug log
        res.json(results);
    });
};

export const bookFlight = (req, res) => {
    const { flightId } = req.body;
    if (!flightId) {
        return res.status(400).json({ message: 'flightId is required' });
    }
    db.query('INSERT INTO bookings (userId, type, itemId) VALUES (1, "flight", ?)', [flightId], (err) => {
        if (err) {
            console.error('Error booking flight:', err.message);
            return res.status(500).json({ message: 'Error booking flight', error: err.message });
        }
        res.json({ message: 'Flight booked successfully' });
    });
};

export const createFlight = (req, res) => {
    const { airline_name, source, destination, departure_time, arrival_time, price, seats_available } = req.body;
    const imagePath = req.file ? req.file.path : null;

    // Validate required fields
    if (!airline_name || !source || !destination || !departure_time || !arrival_time || !price || !seats_available) {
        return res.status(400).json({ message: 'All fields (airline_name, source, destination, departure_time, arrival_time, price, seats_available) are required' });
    }

    db.query(
        'INSERT INTO flights (airline_name, source, destination, departure_time, arrival_time, price, seats_available, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [airline_name, source, destination, departure_time, arrival_time, price, seats_available, imagePath],
        (err) => {
            if (err) {
                console.error('Error creating flight:', err.message);
                return res.status(500).json({ message: 'Error creating flight', error: err.message });
            }
            res.json({ message: 'Flight created successfully' });
        }
    );
};