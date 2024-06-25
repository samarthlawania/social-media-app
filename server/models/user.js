import mongoose, { Schema } from "mongoose";
import FriendRequest from "../models/friendsrequest.js";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please enter your first name"],
    },
    lastname: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be greater than 6 characters"],
      select: true,
    },
    location: { type: String },
    profileURL: { type: String },
    profession: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    friendrequests: [{ type: Schema.Types.ObjectId, ref: "FriendRequest" }],
    views: [{ type: String }],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
