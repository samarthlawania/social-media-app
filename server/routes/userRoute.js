import express from "express";
import path from "path";
import {
  verifyemail,
  requestpasswordreset,
  passwordreset,
  changepassword,
  getuser,
  updateuser,
  friendrequest,
  getfriendrequests,
  friendaccept,
  profileviews,
  suggestedfriends,
} from "../controllers/usercontroller.js";
import userauth from "../middleware/authmiddleware.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

//user-route
router.post("/verify/:userId/:token", verifyemail);

router.post("/request-password-reset", requestpasswordreset);
router.get("/reset-password/:userId/:token", passwordreset);
router.post("/change-password/:userId/:token", changepassword);

//user-routes
router.post("/get-user", userauth, getuser);
router.put("/update-user", userauth, updateuser);
router.post("/friend-request", userauth, friendrequest);
router.post("/get-friend-requests", userauth, getfriendrequests);
router.post("/friend-accept", userauth, friendaccept);

router.post("/profile-view", userauth, profileviews);

router.post("/suggested-friends", userauth, suggestedfriends);

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "../server/views/verified.html"));
});

export default router;
