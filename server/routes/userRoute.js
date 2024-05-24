import express from "express";
import path from "path";
import {
  verifyemail,
  requestpasswordreset,
  passwordreset,
  changepassword,
  getuser,
  updateuser,
} from "../controllers/usercontroller.js";
import userauth from "../middleware/authmiddleware.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

//user-route

router.post("/get-user/:id", userauth, getuser);
router.put("update-user/", userauth, updateuser);

router.post("/verify/:userId/:token", verifyemail);

router.post("/request-password-reset", requestpasswordreset);
router.get("/reset-password/:userId/:token", passwordreset);
router.post("/change-password/:userId/:token", changepassword);

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "../server/views/verified.html"));
});

export default router;
