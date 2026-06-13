// models/Otp.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OtpModel = sequelize.define("Otp", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default OtpModel;