import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  location: {
    type: DataTypes.STRING,
  },
  start_date: {
    type: DataTypes.DATEONLY, // Using DATEONLY for date without time
  },
  end_date: {
    type: DataTypes.DATEONLY, // Using DATEONLY for date without time
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  slots_available: {
    type: DataTypes.INTEGER,
  },
  image_path: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'packages',
  timestamps: false
});

export default Package;