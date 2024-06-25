import VerificationToken from "../models/emailverification.js";
import Users from "../models/user.js";
import FriendRequest from "../models/friendsrequest.js";
import { comparePassword, hashString, jsonwebtoken } from "../utils/index.js";
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
    const { userId } = req.params;
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
  console.log("getuser");
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
      res.status(400).json({ message: "All fields are required" });
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
    console.log(user);
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    await user.populate({ path: "friends", select: "-password" });

    const token = await jsonwebtoken(user?._id);
    user.password = undefined;
    res.status(200).json({
      user,
      message: "User updated succesully",
      token,
      user,
      success: true,
    });
  } catch (error) {
    console.log("oiujhgffgvhb");
    res.status(400).json({ message: error.message });
  }
};

export const friendrequest = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { requestTo } = req.body;
    const requestexist = await FriendRequest.findOne({
      requestTo,
      requestFrom: userId,
    });
    if (requestexist) {
      res
        .status(400)
        .json({ success: "failed", message: "Request already sent" });
      return;
    }
    const request = new FriendRequest({
      requestTo,
      requestFrom: userId,
    });
    await request.save();
    const user = await Users.findById(requestTo).populate("friendrequests");
    console.log(user);
    res
      .status(200)
      .json({ success: true, message: "Request sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

export const getfriendrequests = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstname lastname profile",
      })
      .limit(10)
      .sort({ _id: -1 });
    res.status(200).json({ data: request, success: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const friendaccept = async (req, res) => {
  try {
    const userId = req.body.user.userId;
    const { rid, status } = req.body;

    const request = await FriendRequest.findById(rid);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.requestTo.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    await FriendRequest.findByIdAndUpdate(rid, { requestStatus: status });

    if (status === "accepted") {
      const user = await Users.findById(userId);
      const friend = await Users.findById(request.requestFrom);

      if (user && friend) {
        user.friends.push(request.requestFrom);
        friend.friends.push(userId);

        await Promise.all([user.save(), friend.save()]);
        await FriendRequest.findByIdAndDelete(rid);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }

    res
      .status(200)
      .json({ message: "Friend request status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const profileviews = async (req, res) => {
  const { userId } = req.body.user;
  const { id } = req.body;
  try {
    const user = await Users.findById(id);
    const profileviews = user.views;
    if (!profileviews.includes(userId)) {
      profileviews.push(userId);
      await user.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const suggestedfriends = async (req, res) => {
  const { userId } = req.body.user;
  try {
    let queryobject = {};
    queryobject._id = { $in: [userId] };
    queryobject.friends = { $nin: [userId] };
    let queryresult = Users.find(queryobject);
    queryresult = queryresult
      .limit(15)
      .select("firstName lastName profileUrl profession -password");
    const suggestedfriends = await queryresult;
    res.status(200).json({ data: suggestedfriends, success: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
