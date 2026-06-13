import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const BlockModel = sequelize.define(
  "Block",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    totalFloors: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "blocks",
    timestamps: true,
  }
);

export default BlockModel;