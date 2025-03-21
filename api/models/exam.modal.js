import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, 'Must have exactly 4 options'],
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    marks: {
        type: Number,
        required: true,
        min: 1, // Ensures each question has at least 1 mark
    }
});

function arrayLimit(val) {
    return val.length === 4;
}

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    department: {
        type: String,
        enum: ["ME", "EE", "CE", "CSE", "ECE"],
        required: true,
    },
    year: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    questions: [questionSchema],
    duration: {
        type: Number, // duration in minutes
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
        default: function () {
            return this.questions.reduce((sum, q) => sum + q.marks, 0);
        }
    }
}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
