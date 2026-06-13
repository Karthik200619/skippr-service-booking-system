// models/Booking.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const BookingModel = sequelize.define("Booking", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    service: {
        type: DataTypes.ENUM(
            "CAR_CLEANING",
            "WASHROOM_CLEANING",
            "DEEP_CLEANING"
        ),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(
            "PENDING",
            "APPROVED",
            "REJECTED"
        ),
        defaultValue: "PENDING"
    },

  bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },

    timeSlot: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    status: {
        type: DataTypes.ENUM(
            "PENDING",
            "ASSIGNED",
            "COMPLETED"
        ),
        defaultValue: "PENDING",
    },

    remarks: {
        type: DataTypes.TEXT,
    },
});

export default BookingModel;