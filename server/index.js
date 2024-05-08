import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './dbconfig/index.js';
import helmet from 'helmet';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use(router);

app.listen(PORT, () => {
    console.log(`Connected to PORT ${PORT}`);
});
