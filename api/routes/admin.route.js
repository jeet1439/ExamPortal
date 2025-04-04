import express from 'express';
import multer from 'multer';
const router = express.Router();
import {getUnverifiedStudents,approveStudent,rejectStudent, getStudentByFilter, sendEmailToUser, addTeacher, addQuestionBank, getUserQuestionBanks, deleteQuestion} from '../controllers/admin.controller.js';
import { createExam, deleteExam, getAllExam, markExamLiveAndUnlive } from '../controllers/examAdmin.controller.js';
import { questionBankStorage } from '../cloud.config.js';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';
import { verify } from 'crypto';
// Route to get all unverified students
router.get("/students/unverified", verifyToken, verifyAdmin, getUnverifiedStudents);
// Route to approve a student
router.put("/students/approve/:id",verifyToken, verifyAdmin, approveStudent);
// Route to reject a student
router.delete("/students/reject/:id",verifyToken, verifyAdmin, rejectStudent);
//route to conformations
router.get("/email/users", verifyToken, verifyAdmin, getStudentByFilter);
router.post("/email/send-email", verifyToken, verifyAdmin, sendEmailToUser);
router.post("/add-teacher",addTeacher);

//route for adding exam
router.post("/exam/add-new", verifyAdmin, createExam);
router.delete("/exam/deleteExam/:id", verifyToken, verifyAdmin, deleteExam);
router.patch("/exam/liveExam/:id",verifyToken,verifyAdmin,markExamLiveAndUnlive);
router.get("/exam/get-all", verifyToken, verifyAdmin , getAllExam);  


//router for adding qB
const upload = multer({ storage: questionBankStorage });
router.post("/question-bank",verifyToken,verifyAdmin,upload.single("file"),addQuestionBank);
router.get("/question-bank", verifyToken, getUserQuestionBanks);
router.delete("/question-bank/:id",verifyToken,verifyAdmin,deleteQuestion);
export default router;
