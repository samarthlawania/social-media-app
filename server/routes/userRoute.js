import express from "express";
import path from "path";
import { verifyemail } from "../controllers/usercontroller.js";


const router = express.Router();
const __dirname = path.resolve(path.dirname(""));


router.post("/verify/:userId/:token",verifyemail);

router.get("/verified",(req,res)=>{
    res.sendFile(path.join(__dirname,"../server/views/verified.html"))
})

export default router;