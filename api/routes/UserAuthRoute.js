import express from "express";
import { Test } from "../controllers/UserAuthController.js";

const UserAuthRouter = express.Router();
UserAuthRouter.get("/test", Test);

export default UserAuthRouter;
