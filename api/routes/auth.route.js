import express from 'express';
const router = express.Router();

import multer from 'multer';
import { storage } from '../cloud.config.js';

const upload = multer({ storage });

import { signup } from '../controllers/auth.controller.js';

router.route("/signup")
   .post(upload.single("validId"), signup);


export default router;   