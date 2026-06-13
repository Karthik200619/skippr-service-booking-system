// models/Apartment.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ApartmentModel = sequelize.define("Apartment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  address: {
    type: DataTypes.TEXT,
  },

  totalBlocks: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

export default ApartmentModel;