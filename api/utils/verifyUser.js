import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.modal.js'; // Import the User model
import { errorHandler } from './error.js';

dotenv.config();

// Middleware to verify token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'Unauthorized - No Token Provided'));
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return next(errorHandler(401, 'Unauthorized - Invalid Token'));
        }

        try {
            // Fetch user details from the database
            const user = await User.findById(decoded.id);
            if (!user) {
                return next(errorHandler(404, 'User not found'));
            }

            req.user = user; // Attach user object to request
            next();
        } catch (error) {
            return next(errorHandler(500, 'Internal Server Error'));
        }
    });
};

// Middleware to verify if user is admin
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, async (err) => {
        if (err) return next(err);

        if (!req.user.isAdmin) {
            return next(errorHandler(403, 'Access Denied - Admins Only'));
        }
        next(); 
    });
};
