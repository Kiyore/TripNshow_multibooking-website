import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cab = sequelize.define('Cab', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cab_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  driver_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pickup_location: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  drop_location: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'cabs',
  timestamps: false,
});

export default Cab;
