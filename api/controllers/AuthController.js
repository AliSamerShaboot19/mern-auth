// req from clientside to server
// res to client side to server

import UserAuth from "../models/UserAuth.js";
import bcryptjs from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const SignUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new UserAuth({ name, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    next(ErrorHandler(500, error.message));
  }
};

export const SignIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await UserAuth.findOne({ email });
    if (!validUser) return next(ErrorHandler(404, "Invalid credentials"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) return next(ErrorHandler(401, "Invalid Password"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: hashedPassword, ...others } = validUser._doc;
    const expireDate = new Date(Date.now() + 3600000);
    res
      .cookie("access_token", token, { httpOnly: true, expires: expireDate })
      .status(200)
      .json({ success: true, data: others });
  } catch (error) {
    next(error);
  }
};
