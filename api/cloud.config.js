import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

export { cloudinary, storage };