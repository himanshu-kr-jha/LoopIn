const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: false }, // Not required for Google users
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Not required for Google users
    role: {
      type: String,
      enum: ["societyAdmin", "student", "mainAdmin"],
      default: "student",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    profileimage: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
module.exports = User;
