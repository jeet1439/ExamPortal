import User from '../models/user.modal.js';
import bcryptjs from 'bcryptjs';

import dotenv from 'dotenv'
dotenv.config();

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
        res.status(201).json({ message: "Rejistration sent for validation!" });
    } catch (error) {
        next(error);
    }    
}