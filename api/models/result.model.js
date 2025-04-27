import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true,
  },
  selectedOption: {
    type: String, // selected option as string to match with correctAnswer
    required: false,
  },
});

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
  },
  durationTaken: {
    type: Number, // in seconds
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Result = mongoose.model("Result", resultSchema);

export default Result;
