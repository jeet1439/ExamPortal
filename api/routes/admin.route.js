import express from 'express';
const router = express.Router();
import {getUnverifiedStudents,approveStudent,rejectStudent, getStudentByFilter, sendEmailToUser, addTeacher} from '../controllers/admin.controller.js';

import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';
// Route to get all unverified students
router.get("/students/unverified", verifyToken, verifyAdmin, getUnverifiedStudents);
// Route to approve a student
router.put("/students/approve/:id",verifyToken, verifyAdmin, approveStudent);
// Route to reject a student
router.delete("/students/reject/:id",verifyToken, verifyAdmin, rejectStudent);
router.get("/email/users", verifyToken, verifyAdmin, getStudentByFilter);
router.post("/email/send-email", verifyToken, verifyAdmin, sendEmailToUser);

router.post("/add-teacher",addTeacher);



export default router;
