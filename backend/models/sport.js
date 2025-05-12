import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Sport = sequelize.define('Sport', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  team1: {
    type: DataTypes.STRING,
  },
  team2: {
    type: DataTypes.STRING,
  },
  venue: {
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
  tableName: 'sports',
  timestamps: false
});

export default Sport;