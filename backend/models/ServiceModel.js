// models/ServiceModel.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ServiceModel = sequelize.define("Service", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: "services",
    timestamps: true
});

export default ServiceModel;