import VerificationToken from "../models/emailverification.js";
import Users from "../models/user.js";
import { comparePassword, hashString } from "../utils/index.js";
import PasswordReset from "../models/passwordreset.js";
import { sendmailresetpassword } from "../utils/sendEmail.js";

export const verifyemail = async (req, res) => {
  const { code } = req.body;
  console.log(req.body);
  const { userId, token } = req.params;
  console.log(userId);
  // console.log(result);

  try {
    const result = await VerificationToken.findOne({ userId });
    console.log("result" + result);
    if (result) {
      const { expiresAt, token: hashedToken, activationcode } = result;
      //console.log(expiresAt, token);

      if (expiresAt < Date.now()) {
        VerificationToken.findOneAndDelete({ userId })
          .then(() => {
            Users.findOneAndDelete({ _id: userId })
              .then(() => {
                const message = "Verification token has expired.";
                res.redirect(`/users/verified?status=error&message=${message}`);
              })
              .catch((err) => {
                res.redirect(`/users/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error + "erf");
            res.redirect(`/users/verified?message=`);
          });
      } else {
        //token valid
        console.log(activationcode + "df" + code);
        if (activationcode == code) {
          console.log(token + "\n" + "hashedToken\n" + hashedToken);
          comparePassword(token, hashedToken)
            .then((isMatch) => {
              if (isMatch) {
                console.log("fvkngk");
                Users.findOneAndUpdate({ _id: userId }, { verified: true })
                  .then(() => {
                    VerificationToken.findOneAndDelete({ userId }).then(() => {
                      const message = "Email verified successfully";
                      console.log(message);
                      res.status(200).json({ success: true, message });
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    const message = "Verification failed or link is invalid";
                    console.log(message);
                    res.redirect(
                      `/user/verified?status=error&message=${message}`
                    );
                  });
              } else {
                // invalid token
                console.log("k");
                const message = "Verification failed or link is invalid";
                console.log(message);
                res.redirect(`/user/verified?status=error&message=${message}`);
              }
            })
            .catch((err) => {
              console.log(err);
              res.redirect(`/user/verified?message=`);
            });
        } else {
          const message = "Invalid verification link. Try again later.";
          console.log(message);
          res.redirect(`/users/verified?status=error&message=${message}`);
        }
      }
    } else {
      const message = "Invalid verification link. Try again later.";
      console.log(message);
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/user/verified?message=`);
  }
};
export const requestpasswordreset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "No user found with this email",
      });
    }

    const existingrequest = await PasswordReset.findOne({ email });
    console.log(existingrequest);
    if (existingrequest) {
      if (existingrequest.expiresAt > Date.now()) {
        return res.status(400).json({
          status: "Pending",
          message:
            "Password reset request already sent. Please check your email.",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    console.log("mail ja rha hai");
    const { token } = await sendmailresetpassword(user, res);
    console.log("mail chla gya");

    // token = await PasswordReset.findOne({ email });

    // console.log(token);

    res.status(200).json({
      status: "Success",
      message: "Password reset request has been sent. Please check your email.",
      userId: user._id,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const passwordreset = async (req, res) => {
  const { userId, token } = req.params;
  console.log("reset k andr se uhun" + userId);
  try {
    const user = await Users.findById(userId);
    if (!user) {
      const message = "No user found with this id";
      console.log(message);
      res.redirect(
        `/user/reset-password?type=reset&status=error&message=${message}`
      );
    }

    const existingrequest = await PasswordReset.findOne({ userId });

    if (!existingrequest) {
      const message = "No password reset request found for this user";
      console.log(message);
      res.redirect(`/user/reset-password?status=error&message=${message}`);
    }

    const { token: resettoken, expiresAt } = existingrequest;

    if (expiresAt < Date.now()) {
      await PasswordReset.findOneAndDelete({ userId });
      const message =
        "Password reset link has expired. Please request a new one.";
      console.log(message);
      res.redirect(`/user/reset-password?status=error&message=${message}`);
    } else {
      const isMatch = comparePassword(token, resettoken);
      if (!isMatch) {
        const message = "Invalid token. Please try again.";
        console.log(message);
        res.redirect(`/user/reset-password?status=error&message=${message}`);
      } else {
        res.status(200).json({
          status: "Success",
          message: "Password link is okay",
        });
        //res.redirect(`/user/reset-password?type=reset&id={userId}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const changepassword = async (req, res, next) => {
  console.log("changepassword");
  try {
    const { password, confirmpassword } = req.body;
    const {userId} = req.params;
    console.log(password, confirmpassword);
    if (password !== confirmpassword) {
      const message = "Passwords do not match";
      console.log(message);
      res.redirect(`/user/change-password?status=error&message=${message}`);
      return;
    }
    const hashedpassword = await hashString(password);
    const user = await Users.findByIdAndUpdate(
      { _id: userId },
      { password: hashedpassword }
    );
    console.log(user);
    if (user) {
      await PasswordReset.findOneAndDelete({ userId });
      res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    console.log("oiujhgffgvhb" + error);
    res.status(404).json({ message: error.message });
  }
};

export const getuser = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const user = await Users.findById(id ?? userId).populate({
      path: "friends",
      password: "-password",
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    user.password = undefined;
    res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateuser = async (req, res) => {
  try {
    const { firstname, lastname, location, profile, profession } = req.body;
    if (!(firstname || lastname || location || profile || profession)) {
      res.status.json({ message: "All fields are required" });
    }
    const { userId } = req.body.user;
    const updateUser = {
      firstname,
      lastname,
      location,
      profile,
      profession,
    };

    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    await user.populate({ path: "friends", select: "-password" });

    const token = generateToken(user._id);
    user.password = undefined;
    res
      .status(200)
      .json({ user, message: "User updated succesully", token, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
