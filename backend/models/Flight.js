import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Flight = sequelize.define('Flight', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  airline_name: {
    type: DataTypes.STRING,
  },
  source: {
    type: DataTypes.STRING,
  },
  destination: {
    type: DataTypes.STRING,
  },
  departure_time: {
    type: DataTypes.TIME,
  },
  arrival_time: {
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
  tableName: 'flights',
  timestamps: false
});

export default Flight;
