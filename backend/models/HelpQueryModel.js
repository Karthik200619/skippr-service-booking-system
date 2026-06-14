import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const HelpQueryModel = sequelize.define(
  "HelpQuery",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "RESOLVED"),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "help_queries",
    timestamps: true,
  }
);

export default HelpQueryModel;
