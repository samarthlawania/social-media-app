import Users from "../models/user.js";
import { hashString, comparePassword, jsonwebtoken } from "../utils/index.js";
import { sendVerificationmail } from "../utils/sendEmail.js";
import VerificationToken from "../models/emailverification.js";

//password-012345

export const register = async (req, res, next) => {
  console.log("Attempting to register a new user");

  const { firstname, lastname, email, password } = req.body;

  // Validate if all required fields are filled
  if (!(firstname && lastname && email && password)) {
    return res.status(400).json({ message: "Provide all required fields" });
  }

  try {
    const userExist = await Users.findOne({ email });
    console.log(userExist ? "User already exists" : "No existing user found");

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashString(password);
    console.log("Password hashed successfully");

    const user = await Users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    console.log("User created successfully:", user);

    const { token } = await sendVerificationmail(user, res);

    // Save the user
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
      token,
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!(email || password)) {
      next("Provide required fiels");
      return;
    }
    console.log(email);
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstname lastname location profileURL -password",
    });
    if (!user) {
      next("user does not exist");
      return;
    }
    if (!user?.verified) {
      next("Please verify");
      return;
    }
    console.log(password);
    console.log(user?.password);
    const isMatch = await comparePassword(password, user?.password);
    console.log(isMatch);
    if (!isMatch) {
      console.log("glt kr diya");
      next("Invalid email or password");
      return;
    }
    user.password = undefined;
    const token = jsonwebtoken(user?._id);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
