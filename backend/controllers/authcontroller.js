import User from '../models/User.js';
//import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
  logger: true,
});

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Received signup data:', { name, email, password });
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create user (password will be hashed in the model hook)
    const user = await User.create({ name, email, password, is_verified: true, wallet: 200000.00 });
    console.log('User inserted, ID:', user.id);

    // Optional: Send welcome email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to TripNShow',
      text: `Hello ${name}, welcome to TripNShow! Your account has been created.`,
    });
    console.log('Welcome email sent to:', email);

    // Generate and send token
    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, wallet: user.wallet },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Signup successful', token, userId: user.id });
  } catch (error) {
    console.error('Signup error details:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Error during signup', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('User found for login:', user);

    // Generate and send token
    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, wallet: user.wallet },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};