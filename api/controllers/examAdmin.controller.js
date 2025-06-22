import Exam from "../models/exam.modal.js";

// Controller function to create a new exam
export const createExam = async (req, res) => {
    try {
        const { title, description, department, year, questions, duration, examDate } = req.body;

        //Check if all required fields are provided
        if (!title || !department || !year || !duration || !examDate) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        //Ensure the `year` is within the valid range
        if (year < 1 || year > 4) {
            return res.status(400).json({ message: "Invalid year. Must be between 1 and 4." });
        }

        //Parse `examDate` and check if it is valid
        const parsedExamDate = new Date(examDate);
        if (isNaN(parsedExamDate.getTime())) {
            return res.status(400).json({ message: "Invalid exam date format." });
        }

        //Validate `questions` array (optional)
        if (questions && !Array.isArray(questions)) {
            return res.status(400).json({ message: "Questions must be an array." });
        }

       //Create a new exam
        const newExam = new Exam({
            title,
            description,
            department,
            year,
            questions: questions || [], // Default to an empty array if not provided
            duration,
            examDate: parsedExamDate, // Store properly formatted date
            isLive: false,
            isPublished:false,
            createdBy:req.user
        });

        await newExam.save();
        return res.status(201).json({ message: "Exam created successfully!", exam: newExam });

    } catch (error) {
        console.error("Error in addExam:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Controller function to delete an exam by ID
export const deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExam = await Exam.findByIdAndDelete(id);
        
        if (!deletedExam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllExam = async (req, res) => {
    try {
        const exams = await Exam.find(); // Fetch all exams from the database
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exams", error });
    }
};

//gives all the live exams
export const markExamLiveAndUnlive = async (req, res) => {
    const { id } = req.params;  // Expecting the exam's ID to be passed
  
    try {
      const exam = await Exam.findById(id);
      if (!exam) return res.status(404).json({ message: "Exam not found" });
  
      exam.isLive = !exam.isLive;  // Toggle
      await exam.save();
  
      res.status(200).json({ message: "Exam is now live" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error marking the exam as live" });
    }
  };