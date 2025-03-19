import dotenv from 'dotenv';
dotenv.config();
import User from "../models/user.modal.js";
import nodemailer from "nodemailer";
import transporter from "../index.js";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';



const generatePassword = ()=>{
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

export const sendEmailToUser = async (req,res)=>{
try{
  const {users,message,subject}=req.body;
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
}catch(err){
res.status(500).json({message:"Failed to send emails", err });
}

};

export const addTeacher = async(req,res)=>{
  const {username , email} = req.body;
  try{
    let user = await User.findOne({email});
    if(user) return res.status(400).json({ message: "Teacher already exists!" });

    //create password 
     const password = generatePassword();
     const hashedPassword = await bcrypt.hash(password,10);
      user = new User({
         username,
         email,
         password: hashedPassword,
         isAdmin : false,
         isVerified:true
     })

     await user.save();
     await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Admin Dashboard Login Credentials",
      text: `Hello ${username},\n\nYour login password: ${password}\n\nYou must log in within 1 hour, or the password will expire.\n\nRegards,\nAdmin`,
    });
    res.status(201).json({ message: "Teacher added and email sent! If Email not sent Check the Spam or Contact with the Admin" });
  }catch(error){
     console.error(error);
     res.status(500).json({ message: "Error adding teacher" });
  } 
};

