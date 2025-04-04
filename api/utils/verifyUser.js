import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.modal.js'; // Import the User model
import { errorHandler } from './error.js';

dotenv.config();

// Middleware to verify token
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            console.log("❌ No Token Provided");
            return next(errorHandler(401, 'Unauthorized - No Token Provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("✅ Decoded Token:", decoded);

        // Fetch user details from the database
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("❌ User Not Found in Database");
            return next(errorHandler(404, 'User not found'));
        }

        req.user = user; // Attach user object to request
        // console.log("👤 Verified User:", req.user);
        next();
    } catch (error) {
        console.log("❌ Token Verification Error:", error.message);
        return next(errorHandler(401, 'Unauthorized - Invalid Token'));
    }
};

// Middleware to verify if user is admin
export const verifyAdmin = async (req, res, next) => {
    try {
        await verifyToken(req, res, () => {
            if (!req.user.isAdmin) {
                console.log("⛔ Access Denied - User is Not Admin");
                return next(errorHandler(403, 'Access Denied - Admins Only'));
            }
            // console.log("✅ Admin Verified");
            next();
        });
    } catch (error) {
        console.log("❌ Admin Verification Error:", error.message);
        return next(errorHandler(500, 'Internal Server Error'));
    }
};
