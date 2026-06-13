// models/Notification.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const NotificationModel = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  title: {
    type: DataTypes.STRING,
  },

  message: {
    type: DataTypes.TEXT,
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default NotificationModel;