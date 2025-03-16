import jwt from 'jsonwebtoken';
import { errorHandeler } from './error.js';

import dotenv from 'dotenv';
dotenv.config();

// console.log(process.env.VITE_JWT_SECRET);

export const verifyToken = (req, res, next) =>{
    const token = req.cookies.access_token;
    if(!token){
       return next(errorHandeler(401, 'Unotherrized'));
    }
    jwt.verify(token , process.env.VITE_JWT_SECRET , (err, user) => {
        if(err){
            return next(errorHandeler(401, 'Unotherized'));
        }
        req.user = user;
        next();
    });
};