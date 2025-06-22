import express from 'express';
const router = express.Router();
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';
import { getLiveExams, getQuestionBanks, getUpcomingExams, getResult} from '../controllers/student.controller.js';

router.get("/live-exams",verifyToken,getLiveExams);
router.get("/exams/upcoming",verifyToken,getUpcomingExams);
router.get('/question-bank',verifyToken,getQuestionBanks);

//route for getting th estudent result
router.get('/results', verifyToken, getResult);


export default router; 