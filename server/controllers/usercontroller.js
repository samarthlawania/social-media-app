import mongoose from "mongoose";
import VerificationToken from "../models/emailverification.js";
import Users from "../models/user.js";
import { comparePassword } from "../utils/index.js";

export const verifyemail = async (req, res) => {
  const { code } = req.body;
  console.log(req.body);
  const { userId, token } = req.params;
  //console.log(token);
  // console.log(result);

  try {
    const result = await VerificationToken.findOne({ userId });
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
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      } else {
        //token valid
        if (activationcode == code) {
          // console.log(token + "hashedToken/n" + hashedToken);
          comparePassword(token, hashedToken)
            .then((isMatch) => {
              if (isMatch) {
                console.log("fvkngk");
                Users.findOneAndUpdate({ _id: userId }, { verified: true })
                  .then(() => {
                    VerificationToken.findOneAndDelete({ userId }).then(() => {
                      const message = "Email verified successfully";
                      console.log(message);
                      res.redirect(
                        `/user/verified?status=success&message=${message}`
                      );
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
