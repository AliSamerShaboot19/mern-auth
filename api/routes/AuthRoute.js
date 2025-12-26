import express from "express";
import { google, SignIn, SignUp } from "../controllers/AuthController.js";

const AuthRoute = express.Router();

AuthRoute.post("/signup", SignUp);
AuthRoute.post("/signin", SignIn);
AuthRoute.post("/google", google);

export default AuthRoute;
