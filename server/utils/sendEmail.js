import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { hashString } from "./index.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import VerificationToken from "../models/emailverification.js";
import PasswordReset from "../models/passwordreset.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { AUTH_PASSWORD, AUTH_EMAIL, App_URL } = process.env;
//console.log(AUTH_PASSWORD)

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export const sendVerificationmail = async (user, res) => {
  const { _id, email, lastname } = user;
  const code = Math.floor(100000 + Math.random() * 900000);
  const token = _id + uuid();
  const templatePath = path.join(
    __dirname,
    "../mails",
    "registration-mail.ejs"
  );
  const hashedToken = await hashString(token);
  console.log("bina hash kiya hua token hai yhe" + token);
  const newVerifiedEmail = await VerificationToken.create({
    userId: _id,
    token: hashedToken, // Use the hashed token
    createdAt: Date.now(),
    expiresAt: Date.now() + 1800000,
    activationcode: code,
  });
  const data = { user, token, code };

  const html = await ejs.renderFile(templatePath, data);
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    html: html,
  };

  await transporter.sendMail(mailOptions);

  // Hash the token
  return { _id, token };
};

export const sendmailresetpassword = async (user, res) => {
  const { _id, email } = user;
  console.log(email);
  const code = Math.floor(100000 + Math.random() * 900000);
  const token = _id + uuid();
  const templatePath = path.join(
    __dirname,
    "../mails",
    "resetpassword-mail.ejs"
  );
  const hashedToken = await hashString(token);
  const new_request = await PasswordReset.create({
    userId: _id,
    token: hashedToken, // Use the hashed token
    createdAt: Date.now(),
    email: email,
    expiresAt: Date.now() + 1800000,
  });
  const data = { user, token };
  const html = await ejs.renderFile(templatePath, data);
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Reset Password",
    html: html,
  };
  //console.log("mail k andr hun");
  await transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log("mail k andr hun");
    })
    .catch((err) => console.log(err));
  console.log("hn khtm");

  return { _id, token };
};
