import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import cookieParser from 'cookie-parser';

const app = express();

const port = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes );
app.use('/api/admin',adminRoutes);

app.get('/', (req, res) => {
    res.send("hello");
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  export default transporter;

const start = async () => {
    try {
        const connectionDb = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MONGO CONNECTED: host: ${connectionDb.connection.host}`);
        
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });

    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    }
}
start();