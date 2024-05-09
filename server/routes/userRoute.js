import express from "express";
import path from "path";
import {
  verifyemail,
  requestpasswordreset,
  passwordreset,
  changepassword
} from "../controllers/usercontroller.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

router.post("/verify/:userId/:token", verifyemail);

router.post("/request-password-reset", requestpasswordreset);
router.get("/reset-password/:userId/:token", passwordreset);
router.post("/reset-password", changepassword);

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "../server/views/verified.html"));
});

export default router;
