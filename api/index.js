import express from 'express';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.route.js'

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

app.use('/api/auth', authRoutes );

app.get('/', (req, res) => {
    res.send("hello");
});

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