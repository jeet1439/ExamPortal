import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function LiveExams() {
  const { currentUser } = useSelector((state) => state.user);
  const [liveExams, setLiveExams] = useState(null);
  const [error, setError] = useState("");

  // State for modal control
  const [showModal, setShowModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);

  // Fetch live exams from backend
  useEffect(() => {
    const fetchLiveExams = async () => {
      try {
        const response = await fetch("/api/student/live-exams", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error fetching live exams");
        }

        setLiveExams(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching live exams:", error.message);
        setLiveExams([]);
      }
    };

    if (currentUser) {
      fetchLiveExams();
    }
  }, [currentUser]);

  // Show modal when Start Exam button is clicked
  const handleStartExam = (examId) => {
    setSelectedExamId(examId);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 border-b-2 border-blue-400 pb-2">
        Live Exams
      </h2>

      {/* Error message */}
      {error && (
        <p className="text-red-700 bg-red-100 border border-red-300 p-3 rounded-md mb-4">
          {error}
        </p>
      )}

      {/* Loading or no exams */}
      {liveExams === null ? (
        <p className="text-lg text-blue-600 text-center">Loading...</p>
      ) : liveExams.length === 0 ? (
        <p className="text-lg text-blue-600 text-center">
          No live exams available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveExams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white border border-blue-200 p-6 rounded-2xl relative"
            >
              {/* Live Badge */}
              <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold text-blue-900 px-3 py-1 rounded-full shadow">
                LIVE
              </span>

              {/* Exam Details */}
              <h3 className="text-xl font-semibold text-center text-blue-900 mb-2">
                {exam.title}
              </h3>
              <p className="text-gray-700">{exam.description}</p>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  <strong className="text-blue-800">⏳ Duration:</strong>{" "}
                  {exam.duration} minutes
                </p>
                <p>
                  <strong className="text-blue-800">🏛 Department:</strong>{" "}
                  {exam.department}
                </p>
                <p>
                  <strong className="text-blue-800">🎓 Year:</strong>{" "}
                  {exam.year}
                </p>
              </div>

              {/* Start Exam Button */}
              <button
                onClick={() => handleStartExam(exam._id)}
                className="mt-6 w-full bg-green-400 hover:bg-green-500 text-blue-900 font-semibold py-2 rounded-md transition"
              >
                Start Exam
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Start Exam</h2>
            <p className="text-gray-700 mb-6">
              Do you want to open the exam in fullscreen and start now?
            </p>
            <div className="flex justify-between">
              {/* YES Button: opens exam in new tab */}
              <button
                onClick={() => {
                  window.open(`/newExam/${selectedExamId}`, "_blank");
                  setShowModal(false);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold"
              >
                ✅ Yes, Start Exam
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-semibold"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
