import express from 'express';
const router = express.Router();

import multer from 'multer';
import { storage } from '../cloud.config.js';

const upload = multer({ storage });

import { signup, studentSignin , registerAdmin, adminLogin } from '../controllers/auth.controller.js';

router.route("/signup")
   .post(upload.single("validId"), signup);

router.route('/signin-student')
    .post(studentSignin);  

router.route('/register-admin')
      .post(registerAdmin);

router.route('/signin-admin')
       .post(adminLogin);      


export default router;    
