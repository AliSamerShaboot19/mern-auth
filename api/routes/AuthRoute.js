import express from "express";
import { SignUp } from "../controllers/AuthController.js";

const AuthRoute = express.Router();

AuthRoute.post("/signup", SignUp);

export default AuthRoute;
