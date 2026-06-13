// models/Flat.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const FlatModel = sequelize.define("Flat", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  block: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  flatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  floor: {
    type: DataTypes.INTEGER,
  },

  parkingSlot: {
    type: DataTypes.STRING,
  },

  isOccupied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default FlatModel;