// models/Flat.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const FlatModel = sequelize.define(
  "Flat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    blockId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    flatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    parkingSlot: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bhkType: {
      type: DataTypes.ENUM("1BHK", "2BHK", "3BHK", "4BHK"),
      defaultValue: "2BHK",
    },

    isOccupied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "flats",
    timestamps: true,
  }
);

export default FlatModel;