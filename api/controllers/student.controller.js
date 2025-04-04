import Exam from "../models/exam.modal.js";
// import User from "../models/user.modal";

//Gets all the live exams 
export const getLiveExams = async (req, res) => {
  try {
    const { department, year } = req.user;

    if (!department || !year) {
      return res.status(400).json({ message: "Invalid user details" });
    }

    // Fetch exams matching department and year
    const exams = await Exam.find({
      department: department,
      year: year,
      isLive: true,
    }).sort({ date: 1 });

    res.status(200).json(exams); // Always return 200, even if no exams found
  } catch (error) {
    console.error("Error in getLiveExams:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



  export const getUpcomingExams = async(req,res)=>{
    try{
      const {department,year}=req.user;
    const exams = await Exam.find({
      department:department,
      year:year,
      isLive:false,
      examDate:{$gt: new Date()} 
    })
    
    if (exams.length === 0) {
      return res.status(200).json({ message: "No upcoming exams found", exams: [] });
    }

    res.status(200).json(exams);
    }catch(error){
      res.status(500).json({ message: "Error fetching upcoming exams", error });
    }
    
  };




