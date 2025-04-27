import express from 'express';
const router = express.Router();
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';
import { getExamById, submitExam } from '../controllers/student.controller.js';




router.get('/newExam/:examId',verifyToken,getExamById);
router.post('/submitExam',verifyToken,submitExam);



export default router;