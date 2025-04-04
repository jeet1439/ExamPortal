import express from 'express';
const router = express.Router();
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';
import { getLiveExams, getUpcomingExams } from '../controllers/student.controller.js';




router.get("/live-exams",verifyToken,getLiveExams);
router.get("/exams/upcoming",verifyToken,getUpcomingExams);




export default router;