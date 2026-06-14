import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { AdminApi } from "./apis/AdminApi.js";
import { UserApi } from "./apis/UserApi.js";
import { CommonApi } from "./apis/CommonApi.js";
import sequelize from "./config/db.js";
import "./models/index.js";

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

    await sequelize.sync({ alter: true });

    //  first connect to db then server start listening
    app.listen(process.env.PORT, () => {console.log(`Server started on port ${process.env.PORT}`);});
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

connectDB();

//dealing with invalid path
app.use((req, res, next) => {
  console.log(req.url);
  res.json({ message: `${req.url} is invalid path` });
});

//error handling middleware
app.use((err, req, res, next) => {
  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // ✅ HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});