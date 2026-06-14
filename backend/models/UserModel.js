// models/User.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("ADMIN", "CUSTOMER",),
      defaultValue: "CUSTOMER",
    },

    occupantType: {
      type: DataTypes.ENUM("OWNER", "TENANT"),
      allowNull: true,
    },

    approvalStatus: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },

    flatId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default UserModel;