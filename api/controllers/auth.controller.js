import User from '../models/user.modal.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { errorHandler } from '../utils/error.js';

export const signup = async(req, res, next) => {
    const { username, email, password, year, department, section, rollNo } = req.body;

    if( !username || !email || !password || !year || !department || !section || !rollNo){
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            username,
            email, 
            password: hashedPassword, 
            year, 
            department, 
            section, 
            rollNo,
            validId: {
                url: '',
                filename: ''
            }
        });
        if(req.file){
           newUser.validId = {
            url: req.file.path,
            filename: req.file.filename
           }
        }
        await newUser.save();
        res.status(201).json({ message: "Registration sent for validation!" });
    } catch (error) {
        next(error);
    }    
}

export const studentSignin = async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password || email === '' || password === ''){
      return res.status(400).json({ message: 'All fields are required!'})
    }
    try {
        const validUser = await User.findOne({ email });
        if(!validUser){
            return res.status(401).json({ message: 'Wrong credentials!'});
        }
        if(!validUser.isVerified){
            return res.status(403).json({ message: 'Status: Pending for verification' });
        }
        const validPassword = bcryptjs.compare(password, validUser.password);
        if(!validPassword){
            return res.status(401).json({ message: 'Wrong credentials!'})
        }
        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser.toObject();
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        }).json(rest);
    } catch (error) {
        next(error);
    }
}

export const registerAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newAdmin = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour before now
        
        if (!user.isAdmin && user.createdAt > oneHourAgo) {
            // Promote teacher to admin
            user.isAdmin = true;
            await user.save();
        }


        if (!user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Not an admin." });
        }

        
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin },process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        }).json(rest);

    } catch (error) {
        next(error);
    }
};

export const signout = (req, res, next) =>{
    try{
      res.clearCookie('access_token').status(200).json('user has been signed out');
    }catch(error){
      next(error);
    }
  }
