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

export const google = async (req, res, next) => {
  try {
    const user = await UserAuth.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...others } = user._doc;
      const expireDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, { httpOnly: true, expires: expireDate })
        .status(200)
        .json({ success: true, data: others });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const HashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new UserAuth({
        name:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email: req.body.email,
        password: HashedPassword,
        profilePicture: req.body.photoURL,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...others } = newUser._doc;
      const expireDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expireDate,
        })
        .status(200)
        .json({ success: true, data: others });
    }
  } catch (error) {
    next(error);
  }
};
