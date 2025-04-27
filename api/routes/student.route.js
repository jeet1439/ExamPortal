import express from 'express';
const router = express.Router();
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';
import { getLiveExams, getQuestionBanks, getUpcomingExams } from '../controllers/student.controller.js';




router.get("/live-exams",verifyToken,getLiveExams);
router.get("/exams/upcoming",verifyToken,getUpcomingExams);
router.get('/question-bank',verifyToken,getQuestionBanks);




export default router;