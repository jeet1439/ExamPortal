import express from 'express';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send("hello");
});

// app.use('/api/auth', authRoutes);

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