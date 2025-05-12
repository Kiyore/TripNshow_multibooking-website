import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  language: {
    type: DataTypes.STRING,
  },
  genre: {
    type: DataTypes.STRING,
  },
  cinema_hall: {
    type: DataTypes.STRING,
  },
  show_date: {
    type: DataTypes.DATEONLY, // Using DATEONLY for date without time
  },
  show_time: {
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
  tableName: 'movies',
  timestamps: false
});

export default Movie;