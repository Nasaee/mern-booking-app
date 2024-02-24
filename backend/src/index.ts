import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/users.route';
import authRoutes from './routes/auth.route';
import cookiesParser from 'cookie-parser';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import myHotelsRoutes from './routes/my-hotels.route';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(cookiesParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // allow requests from this origin url
    credentials: true, // the url must include credentials http cookies in the header
  })
);

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/my-hotels', myHotelsRoutes);

app.listen(7000, () => {
  console.log('Server is running on localhost:7000');
});
