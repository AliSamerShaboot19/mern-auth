import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserAuthRouter from "./routes/UserAuthRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import cors from "cors";
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
app.use(cors());
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.use(express.json());
app.use("/api/user", UserAuthRouter);
app.use("/api/auth", AuthRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internet Server Error";
  return res.status(statusCode).json({
    sucess: false,
    error: message,
    statusCode: statusCode,
  });
});
