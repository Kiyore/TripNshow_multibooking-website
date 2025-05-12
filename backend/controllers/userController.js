import db from '../config/db.js';

export const getAllUsers = (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ message: 'Error fetching users', error: err.message });
        }
        console.log('Fetched users:', results); // Debug log
        res.json(results);
    });
};

export const createUser = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Note: Password hashing should be handled (e.g., by bcrypt in authRoutes.js). Placeholder here.
    const hashedPassword = password; // Replace with bcrypt.hash(password, 10) if needed

    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
            if (err) {
                console.error('Error creating user:', err.message);
                return res.status(500).json({ message: 'Error creating user', error: err.message });
            }
            const userId = result.insertId;
            console.log('User created, ID:', userId); // Debug log
            res.json({ message: 'User created successfully', userId });
        }
    );
};