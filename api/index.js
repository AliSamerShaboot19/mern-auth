import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserAuthRouter from "./routes/UserAuthRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import cors from "cors";
import multer from "multer";
import UserAuth from "./models/UserAuth.js";
import bcrypt from "bcryptjs";

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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("only images allowed"), false);
    }
  },
});

app.put("/api/user/update", upload.single("image"), async (req, res) => {
  try {
    const { userId, name, email, password } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Id user required",
      });
    }

    const user = await UserAuth.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "user not found",
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (req.file) {
      updateData.profilePicture = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await UserAuth.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "update successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("faild to update ", error);

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          error: "file size exceeds 5MB limit",
        });
      }
    }

    res.status(500).json({
      success: false,
      error: "failed to update user",
      details: error.message,
    });
  }
});

app.use("/api/user", UserAuthRouter);
app.use("/api/auth", AuthRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.delete("/api/user/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const user = await UserAuth.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    await UserAuth.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete account:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete account",
      details: error.message,
    });
  }
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`Error: ${message}`, err.stack);

  return res.status(statusCode).json({
    success: false,
    error: message,
    statusCode: statusCode,
  });
});
