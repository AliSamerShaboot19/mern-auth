import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserAuthRouter from "./routes/UserAuthRoute.js";
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", UserAuthRouter);
