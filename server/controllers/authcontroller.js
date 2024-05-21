import Users from "../models/user.js";
import { hashString, comparePassword, jsonwebtoken } from "../utils/index.js";
import { sendVerificationmail } from "../utils/sendEmail.js";
import VerificationToken from "../models/emailverification.js";

//password-012345

export const register = async (req, res, next) => {
  console.log("hn bhai register krne hi aaya hun idhar");
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

    // const user_token = await VerificationToken.findOne({ userId: user._id });

    // console.log(user_token + "" + user._id);

    const {token} = await sendVerificationmail(user, res);

    const user_token = await VerificationToken.findOne({ userId: user._id });

    console.log(user_token + "" + user._id);

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
      token,
    });
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
