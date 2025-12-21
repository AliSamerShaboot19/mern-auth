import mongoose from "mongoose";

const UserAuthSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg",
    },
  },
  { timestamps: true }
);

const UserAuth = mongoose.model("UserAuth", UserAuthSchema);

export default UserAuth;
