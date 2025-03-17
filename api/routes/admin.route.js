import express from 'express';
const router = express.Router();
import {getUnverifiedStudents,approveStudent,rejectStudent, getStudentByFilter, sendEmailToUser} from '../controllers/admin.controller.js';

// Route to get all unverified students
router.get("/students/unverified", getUnverifiedStudents);

// Route to approve a student
router.put("/students/approve/:id", approveStudent);

// Route to reject a student
router.delete("/students/reject/:id", rejectStudent);

router.get("/email/users",getStudentByFilter);
router.post("/email/send-email",sendEmailToUser);

export default router;
