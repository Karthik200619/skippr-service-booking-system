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
        allowNull: true,
    },

    bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },

    timeSlot: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    status: {
        type: DataTypes.ENUM(
            "PENDING",
            "APPROVED",
            "REJECTED"
        ),
        defaultValue: "PENDING",
    },

    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    priority: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
        defaultValue: "MEDIUM",
        allowNull: false,
    },
});

export default BookingModel;