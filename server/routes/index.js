import express from 'express';
import authroute from './authroute.js';
import userRoute from './userRoute.js';

const router = express.Router();

router.use('/auth',authroute)
router.use('/user',userRoute)

export default router;