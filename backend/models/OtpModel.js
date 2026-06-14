// models/Otp.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OtpModel = sequelize.define("Otp", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
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