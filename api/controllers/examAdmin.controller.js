import Exam from "../models/exam.modal.js";

// Controller function to create a new exam
export const createExam = async (req, res) => {
    try {
        const { title, description, department, year, duration, questions } = req.body;
        
        if (!title || !department || !year || !duration || !questions.length) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const newExam = new Exam({
            title,
            description,
            department,
            year,
            duration,
            questions
        });

        await newExam.save();
        res.status(201).json({ message: "Exam created successfully", exam: newExam });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
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
