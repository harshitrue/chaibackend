// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env"
});

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  });
