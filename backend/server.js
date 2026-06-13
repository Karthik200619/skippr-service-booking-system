import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { AdminApi } from "./apis/AdminApi.js";
import { UserApi } from "./apis/UserApi.js";
import { CommonApi } from "./apis/CommonApi.js";
import sequelize from "./config/db.js";

dotenv.config();

const app = express();

// Middlewares
// body parser middleware
app.use(express.json());
// cookie parser middleware
app.use(cookieParser());

// APIs
app.use("/user-api", UserApi);
app.use("/common-api", CommonApi);
app.use("/admin-api", AdminApi);

// Database Connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connection successful");
    //  first connect to db then server start listening
    app.listen(process.env.PORT, () => {console.log(`Server started on port ${process.env.PORT}`);});
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

connectDB();