import express from "express";
import { SignIn, SignUp } from "../controllers/AuthController.js";

const AuthRoute = express.Router();

AuthRoute.post("/signup", SignUp);
AuthRoute.post("/signin", SignIn);

export default AuthRoute;
