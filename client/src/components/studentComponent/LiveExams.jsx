import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function LiveExams() {
  const { currentUser } = useSelector((state) => state.user);
  const [liveExams, setLiveExams] = useState(null);
  const [error, setError] = useState("");

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
        setLiveExams([]); // Instead of error, just show no exams
      }
    };
    
    if (currentUser) {
      fetchLiveExams();
    }
  }, [currentUser]);

  const handleStartExam = (examId) => {
    const confirmed = window.confirm("Are you sure you want to start the exam?");
    if (confirmed) {
      // Open exam page in a new tab
      window.open(`/newExam/${examId}`);
    }
  };
  

  // return (
  //   <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-200] p-8">
  //     <h2 className="text-3xl font-bold text-[#e0e6ed] mb-6 border-b-2 border-[#547aa5] pb-2">
  //       Live Exams
  //     </h2>

  //     {/* Display error message if there was a fetch error */}
  //     {error && (
  //       <p className="text-red-400 bg-red-900/30 p-3 rounded-md border border-red-500 mb-4">
  //         {error}
  //       </p>
  //     )}

  //     {liveExams === null ? (
  //       <p className="text-lg text-[#aeb6c3] text-center">⏳ Loading...</p>
  //     ) : liveExams.length === 0 ? (
  //       <p className="text-lg text-[#9aa3b2] text-center">
  //         🚀 No live exams available right now.
  //       </p>
  //     ) : (
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //         {liveExams.map((exam) => (
  //           <div
  //             key={exam._id}
  //             className="bg-[#2a2e45] bg-opacity-50 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-[#4c597a] relative transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
  //           >
  //             {/* Live Badge */}
  //             <span className="absolute top-2 right-2 bg-[#00c6a7] text-xs font-bold text-white px-3 py-1 rounded-full shadow-md">
  //               LIVE
  //             </span>

  //             <h3 className="text-xl font-bold text-center text-white bg-gradient-to-r from-[#547aa5] to-[#6d597a] py-2 rounded-md shadow-md">
  //               {exam.title}
  //             </h3>
  //             <p className="text-[#cfd4e1] mt-4">{exam.description}</p>
  //             <p className="mt-4 text-[#c1c6d0]">
  //               <strong className="text-[#e0e6ed]">⏳ Duration:</strong> {exam.duration} minutes
  //             </p>
  //             <p className="text-[#c1c6d0]">
  //               <strong className="text-[#e0e6ed]">🏛 Department:</strong> {exam.department}
  //             </p>
  //             <p className="text-[#c1c6d0]">
  //               <strong className="text-[#e0e6ed]">🎓 Year:</strong> {exam.year}
  //             </p>

  //             <button
  //               onClick={() => handleStartExam(exam._id)}
  //               className="mt-6 w-full bg-[#00c6a7] text-[#14213d] py-3 rounded-md font-semibold text-lg tracking-wide hover:bg-[#008f7a] transition duration-300"
  //             >
  //               🚀 Start Exam
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );
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

    {/* Loading / No Exams */}
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

            <h3 className="text-xl font-semibold text-center text-blue-900 mb-2">
              {exam.title}
            </h3>
            <p className="text-gray-700">{exam.description}</p>

            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>
                <strong className="text-blue-800">⏳ Duration:</strong> {exam.duration} minutes
              </p>
              <p>
                <strong className="text-blue-800">🏛 Department:</strong> {exam.department}
              </p>
              <p>
                <strong className="text-blue-800">🎓 Year:</strong> {exam.year}
              </p>
            </div>

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
  </div>
);

}
