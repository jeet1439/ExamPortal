import Exam from "../models/exam.modal.js";
import QuestionBank from "../models/questionBank.model.js";
import Result from "../models/result.model.js";
// import User from "../models/user.modal";

//Gets all the live exams 
export const getLiveExams = async (req, res) => {
  try {
    const { department, year, _id: studentId } = req.user;

    if (!department || !year) {
      return res.status(400).json({ message: "Invalid user details" });
    }

    // Get exam IDs the student has already submitted
    const submittedResults = await Result.find({ student: studentId }).select('exam');
    const submittedExamIds = submittedResults.map(result => result.exam.toString());

    // Fetch live exams excluding the ones already submitted by the student
    const exams = await Exam.find({
      department,
      year,
      isLive: true,
      _id: { $nin: submittedExamIds }
    }).sort({ date: 1 });

    res.status(200).json(exams);
  } catch (error) {
    console.error("Error in getLiveExams:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getUpcomingExams = async (req, res) => {
  try {
    const { department, year } = req.user;
    const exams = await Exam.find({
      department: department,
      year: year,
      isLive: false,
      examDate: { $gt: new Date() }
    })

    if (exams.length === 0) {
      return res.status(200).json({ message: "No upcoming exams found", exams: [] });
    }

    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming exams", error });
  }

};



export const getQuestionBanks = async (req, res) => {
  try {
    const { department, year } = req.user;
    const questionBank = await QuestionBank.find({
      department: department,
      year: year
    })

    if (questionBank.length === 0) {
      return res.status(200).json({ message: "No upcoming exams found", questionBank: [] });
    }
    res.status(200).json(questionBank);

  } catch (err) {
    res.status(500).json({ message: "Error fetching question banks", err });
  }
};


export const getExamById = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitExam = async (req, res) => {
  try {
    const { examId, answers, timeTaken } = req.body;
    const studentId = req.user.id;  // Assuming user is authenticated

    // If answers is an object, convert it to an array
    const answersArray = Array.isArray(answers)
      ? answers
      : Object.keys(answers).map(key => ({
        questionIndex: Number(key),
        selectedOption: answers[key],
      }));

    // Find the exam by ID
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Calculate total score
    let totalScore = answersArray.reduce((score, { questionIndex, selectedOption }) => {
      const question = exam.questions[questionIndex];
      return question && question.correctAnswer === selectedOption
        ? score + question.marks
        : score;
    }, 0);

    // Create and save the result
    const result = new Result({
      student: studentId,
      exam: examId,
      answers: answersArray,
      score: totalScore,
      durationTaken: timeTaken,
      submittedAt: new Date(),
    });

    await result.save();

    // Respond with success
    res.status(200).json({
      message: "Exam submitted successfully!",
      score: totalScore,
      totalMarks: exam.totalMarks,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error submitting exam" });
  }
};


export const getResult = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Fetch all results for the student and populate the exam
    const results = await Result.find({ student: studentId }).populate('exam');
    // Filter out results where the exam is not published
    const publishedResults = results
      .filter(result => result.exam && result.exam.isPublished)
      .map(result => ({
        examId: result.exam._id,
        examTitle: result.exam.title,
        examDate: result.exam.createdAt,
        marksObtained: result.score,
        totalMarks: result.exam.totalMarks || 20,
      }));

    res.status(200).json(publishedResults);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Server error fetching results' });
  }
};
