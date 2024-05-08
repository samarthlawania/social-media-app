import Users from "../models/user.js";
import { hashString, comparePassword, jsonwebtoken } from "../utils/index.js";
import { sendVerificationmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  //validate if all fields are filled
  if (!(firstname || lastname || email || password)) {
    next("Provide required fiels");
    return;
  }

  try {
    const UserExist = await Users.findOne({ email });
    if (UserExist) {
      next("User already exist");
      return;
    }
    //hash password

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    sendVerificationmail(user, res);

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ essage: err.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!(email || password)) {
      next("Provide required fiels");
      return;
    }
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

    const isMatch = comparePassword(password, user?.password);
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
