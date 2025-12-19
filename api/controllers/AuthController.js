// req from clientside to server
// res to client side to server
import UserAuth from "../models/UserAuth.js";
import bcryptjs from "bcryptjs";
export const SignUp = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new UserAuth({ name, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
