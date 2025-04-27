import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ExamPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`/api/student/newExam/${examId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setExam(data);
        setTimeLeft(data.duration * 60);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };

    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (!exam || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && exam) {
      alert("⏰ Time's up! Submitting your exam...");
      submitExam();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const submitExam = async () => {
    if (!exam || !exam._id) {
      console.error("❌ Cannot submit exam: Exam data is not available.");
      return;
    }

    try {
      const response = await fetch("/api/student/submitExam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          examId: exam._id,
          answers: selectedAnswers,
          timeTaken: exam.duration * 60 - timeLeft,
        }),
      });

      if (response.ok) {
        alert("✅ Exam submitted successfully!");
        window.location.href = "/student-dashboard";
      } else {
        alert("❌ Failed to submit exam.");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("❌ An error occurred during submission.");
    }
  };

  const handleMarkAsRead = () => {
    if (!markedQuestions.includes(currentQuestionIndex)) {
      setMarkedQuestions((prev) => [...prev, currentQuestionIndex]);
    }
  };

  if (!exam) return <p className="text-center text-lg mt-10">Loading exam...</p>;

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/5 bg-white p-4 border-r border-gray-300 shadow-md overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Questions</h2>
        <div className="grid grid-cols-3 gap-3">
          {exam.questions.map((_, index) => {
            const isCurrent = currentQuestionIndex === index;
            const isMarked = markedQuestions.includes(index);
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-full h-14 rounded-full text-sm font-medium transition-all
                  ${isCurrent
                    ? "bg-blue-600 text-white scale-105 shadow-lg"
                    : isMarked
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"}`}
              >
                Q{index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{exam.title}</h1>
          <span className="text-lg font-semibold text-red-600 bg-gray-200 px-4 py-2 rounded shadow-inner">
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg transition-all">
          <h3 className="text-2xl font-semibold mb-4 text-blue-700">Question {currentQuestionIndex + 1}</h3>
          <p className="mb-6 text-gray-800 leading-relaxed">{currentQuestion.question}</p>

          {currentQuestion.options && currentQuestion.options.map((option, idx) => (
            <div key={idx} className="mb-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`q-${currentQuestionIndex}`}
                  value={option}
                  checked={selectedAnswers[currentQuestionIndex] === option}
                  onChange={() =>
                    setSelectedAnswers((prev) => ({
                      ...prev,
                      [currentQuestionIndex]: option,
                    }))
                  }
                  className="accent-blue-600 w-5 h-5"
                />
                <span className="text-gray-700 text-lg">{option}</span>
              </label>
            </div>
          ))}

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestionIndex((i) => Math.max(i - 1, 0))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium disabled:opacity-50"
            >
              ⬅️ Previous
            </button>

            <button
              onClick={handleMarkAsRead}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-full transition"
            >
              ✅ Mark as Read
            </button>

            <button
              onClick={() => setCurrentQuestionIndex((i) => Math.min(i + 1, exam.questions.length - 1))}
              disabled={currentQuestionIndex === exam.questions.length - 1}
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              Save & Next ➡️
            </button>
          </div>
        </div>

        {/* Submit Button */}
        {currentQuestionIndex === exam.questions.length - 1 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => {
                const confirmSubmit = window.confirm("Are you sure you want to submit the exam?");
                if (confirmSubmit) {
                  submitExam();
                } else {
                  alert("🔙 Back to exam panel.");
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full shadow-md text-xl"
            >
              📝 Submit Exam
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamPage;
