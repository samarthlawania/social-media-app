import mongoose, { Schema } from "mongoose";

const emailverification = new Schema({
  userId: { type: String },
  token: { type: String },
  createdAt: { type: Date, default: Date.now() },
  expiresAt: { type: Date, default: Date.now() + 1800000 },
  activationcode: { type: Number },
});

const VerificationToken = mongoose.model(
  "verificationToken",
  emailverification
);

export default VerificationToken;
