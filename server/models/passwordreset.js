import mongoose,{Schema} from 'mongoose';

const passwordereset = new Schema(
  {
    userId: { type: String, unique: true },
    email: { type: String, unique: true },
    token: { type: String },
    creadtedAt: { type: Date },
    expiresAt: { type: Date },
    activationcode: { type: Number },
  },
  { timestamps: true }
);


const PasswordReset = mongoose.model("passwordReset",passwordereset);

export default PasswordReset;