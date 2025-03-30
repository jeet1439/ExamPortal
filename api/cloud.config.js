import dotenv from 'dotenv';
dotenv.config();

import cloudinaryPkg from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const { v2: cloudinary } = cloudinaryPkg;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Exam-Id',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const questionBankStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'QuestionBank',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'docx'],
    },
});

export { cloudinary, storage, questionBankStorage };
