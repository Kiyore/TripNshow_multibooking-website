import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Concert = sequelize.define('Concert', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  artist: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATEONLY, // Using DATEONLY for date without time
  },
  time: {
    type: DataTypes.TIME,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  seats_available: {
    type: DataTypes.INTEGER,
  },
  image_path: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'concerts',
  timestamps: false
});

export default Concert;