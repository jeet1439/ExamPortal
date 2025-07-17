// ✅ Your imports remain the same
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

// ✅ Component
function ExamPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const isSubmittingRef = useRef(false);
  const examContainerRef = useRef(null);

  // Fullscreen monitoring
  const handleFullScreenChange = useCallback(() => {
    const isFullScreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    if (!isFullScreen && started && !isSubmittingRef.current) {
      alert("You exited fullscreen. The exam will now be submitted.");
      submitExam();
    }
  }, [started]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, [handleFullScreenChange]);

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const goFullScreen = () => {
    const elem = examContainerRef.current;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
  };

  const startExam = async () => {
    try {
      const response = await fetch(`/api/student/newExam/${examId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setExam(data);
      setTimeLeft(data.duration * 60);
      setStarted(true);
      goFullScreen();
    } catch (error) {
      console.error("Error starting exam:", error);
    }
  };

  useEffect(() => {
    if (!exam || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [exam, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && exam) {
      alert("Time's up! Submitting your exam...");
      submitExam();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const submitExam = async () => {
    if (!exam || !exam._id || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    document.removeEventListener("fullscreenchange", handleFullScreenChange);
    document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
    document.removeEventListener("MSFullscreenChange", handleFullScreenChange);

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.warn("Could not exit fullscreen:", err);
      }
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
        alert("Exam submitted successfully!");
        window.location.href = "/student-dashboard";
      } else {
        alert("Failed to submit exam.");
      }
    } catch (error) {
      alert("Error submitting exam.");
    }
  };

  const handleMarkAsRead = () => {
    if (!markedQuestions.includes(currentQuestionIndex)) {
      setMarkedQuestions((prev) => [...prev, currentQuestionIndex]);
    }
  };

  if (!started) {
    return (
      <div ref={examContainerRef} className="h-screen flex items-center justify-center bg-blue-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Exam</h2>
          <p className="mb-6 text-gray-600">Click below to go fullscreen and begin.</p>
          <button
            onClick={startExam}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md"
          >
            Go Fullscreen & Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (!exam) return <p className="text-center mt-10">Loading exam...</p>;

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div ref={examContainerRef} className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar with legend */}
      <div className="w-1/5 bg-white border-r border-gray-300 flex flex-col justify-between">
        <div className="p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-center">Questions</h2>
          <div className="grid grid-cols-3 gap-2">
            {exam.questions.map((_, index) => {
              const isCurrent = index === currentQuestionIndex;
              const isMarked = markedQuestions.includes(index);
              const isAnswered = selectedAnswers.hasOwnProperty(index);
              const hasVisited = index <= currentQuestionIndex;

              let bgColor = "bg-white text-gray-700 border border-gray-300";

              if (isMarked) bgColor = "bg-yellow-400 text-white";
              else if (isAnswered) bgColor = "bg-green-500 text-white";
              else if (hasVisited) bgColor = "bg-red-500 text-white";

              if (isCurrent) bgColor += " ring-2 ring-blue-600 scale-105";

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-10 rounded text-sm font-medium transition-all ${bgColor}`}
                >
                  Q{index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* ✅ Legend */}
        <div className="bg-gray-50 border-t p-4 text-sm space-y-2 text-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm" /> <span>Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm" /> <span>Visited but Unanswered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-sm" /> <span>Marked</span>
          </div>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
          <span className="text-lg font-semibold text-red-600 bg-white px-4 py-2 rounded shadow">
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>

        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Question {currentQuestionIndex + 1}</h3>
          <p className="mb-6 text-gray-800">{currentQuestion.question}</p>

          {currentQuestion.options.map((option, idx) => (
            <div key={idx} className="mb-3">
              <label className="flex items-center gap-3">
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
                <span>{option}</span>
              </label>
            </div>
          ))}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex((i) => Math.max(i - 1, 0))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={handleMarkAsRead}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded"
            >
              Mark as Read
            </button>

            <button
              onClick={() => setCurrentQuestionIndex((i) => Math.min(i + 1, exam.questions.length - 1))}
              disabled={currentQuestionIndex === exam.questions.length - 1}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded disabled:opacity-50"
            >
              Save & Next
            </button>
          </div>

          {currentQuestionIndex === exam.questions.length - 1 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowConfirmModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded text-lg"
              >
                Submit Exam
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Submit Exam?</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to submit now?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                disabled={isSubmittingRef.current}
                onClick={() => {
                  setShowConfirmModal(false);
                  submitExam();
                }}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamPage;
