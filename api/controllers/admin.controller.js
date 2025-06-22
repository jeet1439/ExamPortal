import dotenv from 'dotenv';
dotenv.config();
import User from "../models/user.modal.js";
import Exam from "../models/exam.modal.js";
import Result from "../models/result.model.js";
import nodemailer from "nodemailer";
import transporter from "../index.js";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import QuestionBank from '../models/questionBank.model.js';
import { cloudinary } from '../cloud.config.js';


const generatePassword = () => {
  return crypto.randomBytes(3).toString('hex');
}

// Get all students pending verification
export const getUnverifiedStudents = async (req, res) => {
  try {
    const students = await User.find({ isVerified: false });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

// Approve a student (Set isVerified to true)
export const approveStudent = async (req, res) => {
  try {
    const updatedStudent = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error approving student", error });
  }
};

// Reject a student (Delete from database)
export const rejectStudent = async (req, res) => {
  try {
    const deletedStudent = await User.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting student", error });
  }
};


//get the details from the selected filter (notifications and communication)
export const getStudentByFilter = async (req, res) => {
  try {
    const { year, department, rollNo } = req.query;
    let filter = {};
    if (year) filter.year = year;
    if (department) filter.department = department;
    if (rollNo) filter.rollNo = rollNo;
    const users = await User.find(filter).select('email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", err });
  }
};


//send the email to the users via email.......

export const sendEmailToUser = async (req, res) => {
  try {
    const { users, message, subject } = req.body;
    if (!users.length) return res.status(400).json({ message: "No users selected" });
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    for (const user of users) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: subject,
        text: message
      });
    }
    res.json({ message: "Emails sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send emails", err });
  }

};

export const addTeacher = async (req, res) => {
  const { username, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Teacher already exists!" });

    //create password 
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
      isVerified: true
    })

    await user.save();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Admin Dashboard Login Credentials",
      text: `Hello ${username},\n\nYour login password: ${password}\n\nChange Your Password After Logging in \n\n You must log in within 1 hour, or the password will expire.\n\nRegards,\nAdmin`,
    });
    res.status(201).json({ message: "Teacher added and email sent! If Email not sent Check the Spam or Contact with the Admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding teacher" });
  }
};


export const addQuestionBank = async (req, res) => {
  try {
    const { year, department, content } = req.body;
    const postedBy = req.user._id; // Assuming the user ID is attached to req.user

    if (!year || !department || (!content && !req.file)) {
      return res.status(400).json({ message: "Please provide required fields." });
    }

    let fileData = { url: "", filename: "" };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "QuestionBank",
        resource_type: "auto",
      });
      fileData.url = uploadResult.secure_url;
      fileData.filename = uploadResult.public_id;
    }

    const newQuestionBank = new QuestionBank({
      year,
      department,
      content,
      file: fileData,
      postedBy,
    });

    await newQuestionBank.save();
    res.status(201).json({ message: "Question Bank added successfully!" });
  } catch (error) {
    console.error("Error adding question bank:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserQuestionBanks = async (req, res) => {
  try {
    const userId = req.user._id;
    const userQuestionBanks = await QuestionBank.find({ postedBy: userId });

    res.json(userQuestionBanks);
  } catch (error) {
    console.error("Error fetching user question banks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteQuestion = async (req, res) => {
  try {
    let { id } = req.params;
    const questionBank = await QuestionBank.findById(id);
    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }
    if (questionBank.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this question bank" });
    }
    //Delete from Cloudinary
    if (questionBank.file.filename) {
      await cloudinary.uploader.destroy(questionBank.file.filename);
    }
    await QuestionBank.findByIdAndDelete(id);
    res.json({ message: "Question bank deleted successfully!" });
  } catch (error) {
    console.error("Error deleting question bank:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getExamsToPublish = async (req, res) => {
  try {
    const userId = req.user; // The user's ObjectId from auth middleware

    // Get all exams created by the user
    const exams = await Exam.find({ createdBy: userId });

    // Filter exams where at least one student has submitted
    const filteredExams = await Promise.all(
      exams.map(async (exam) => {
        const studentCount = await Result.countDocuments({ exam: exam._id });

        if (studentCount > 0) {
          return {
            _id: exam._id,
            title: exam.title,
            department: exam.department,
            year: exam.year,
            isPublished: exam.isPublished,
            studentCount,
            createdAt: exam.createdAt,
          };
        }
        return null;
      })
    );

    // Return only non-null exams
    const validExams = filteredExams.filter(exam => exam !== null);

    res.status(200).json(validExams);
  } catch (error) {
    console.error("Error in getExamsToPublish:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Publish the Exam Results (Only if there are students who have taken the exam)
export const publishExamResult = async (req, res) => {
  const { examId } = req.params;

  try {
    // Find the exam by ID
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Fetch the number of students who have taken the exam
    const numberOfStudents = await Result.countDocuments({ exam: examId });
    
    // Only publish if the number of students is greater than 0
    if (numberOfStudents <= 0) {
      return res.status(400).json({ message: 'Cannot publish results. No students have taken the exam yet.' });
    }

    // Set isPublished to true and save the exam
    exam.isPublished = true;
    await exam.save();

    // Respond with updated exam data
    res.status(200).json({
      message: 'Exam results published successfully',
      exam: {
        _id: exam._id,
        isPublished: exam.isPublished
      }
    });
  } catch (error) {
    console.error('Error publishing exam result:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unpublish the Exam Results (Only if there are students who have taken the exam)
export const unpublishExamResult = async (req, res) => {
  const { examId } = req.params;

  try {
    // Find the exam by ID
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Fetch the number of students who have taken the exam
    const numberOfStudents = await Result.countDocuments({ exam: examId });
    
    // Only unpublish if the number of students is greater than 0
    if (numberOfStudents <= 0) {
      return res.status(400).json({ message: 'Cannot unpublish results. No students have taken the exam yet.' });
    }

    // Set isPublished to false and save the exam
    exam.isPublished = false;
    await exam.save();

    // Respond with updated exam data
    res.status(200).json({
      message: 'Exam results unpublished successfully',
      exam: {
        _id: exam._id,
        isPublished: exam.isPublished
      }
    });
  } catch (error) {
    console.error('Error unpublishing exam result:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const publishResults = async (req, res) => {
  try {
    const { examId } = req.params;

    await Result.updateMany(
      { exam: examId },
      { isPublished: true }
    );

    res.status(200).json({ message: "Results published successfully" });
  } catch (err) {
    console.error("Error publishing results:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unpublishResults = async (req, res) => {
  try {
    const { examId } = req.params;

    await Result.updateMany(
      { exam: examId },
      { isPublished: false }
    );

    res.status(200).json({ message: "Results unpublished successfully" });
  } catch (err) {
    console.error("Error unpublishing results:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};