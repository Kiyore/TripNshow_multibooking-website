import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Bus = sequelize.define('Bus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bus_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departure_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  arrival_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  seats_available: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_path: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'buses',
  timestamps: false
});

export default Bus;