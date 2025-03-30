import mongoose from 'mongoose';

const questionBankSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    department: {
      type: String,
      required: true,
      enum: ["ME", "EE", "CE", "CSE", "ECE"],
    },
    content: {
      type: String,
      default: "",
    },
    file:{
        url: {
            type: String,
            default:''
        },
        filename : String
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const QuestionBank = mongoose.model("QuestionBank", questionBankSchema);

export default QuestionBank;
