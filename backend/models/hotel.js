import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: { // ✅ This matches your DB
    type: DataTypes.STRING(100),
    allowNull: false
  },
  check_in: {
    type: DataTypes.TIME,
    allowNull: false
  },
  check_out: {
    type: DataTypes.TIME,
    allowNull: false
  },
  room_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  price_per_night: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  rooms_available: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'hotels',
  timestamps: false
});

export default Hotel;
