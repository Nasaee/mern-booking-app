import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/users.route';
import authRoutes from './routes/auth.route';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // allow requests from this origin url
    credentials: true, // the url must include credentials http cookies in the header
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(7000, () => {
  console.log('Server is running on localhost:7000');
});
