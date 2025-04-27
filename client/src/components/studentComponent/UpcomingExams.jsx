import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function UpcomingExams() {
  const { currentUser } = useSelector((state) => state.user);
  const [upcomingExams, setUpcomingExams] = useState(null);
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const fetchUpcomingExams = async () => {
      try {
        const response = await fetch("/api/student/exams/upcoming", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUpcomingExams(Array.isArray(data) ? data : []);
        } else {
          console.log(response);
          setError("Error fetching upcoming exams");
          setUpcomingExams([]);
        }
      } catch (error) {
        setError("Error fetching upcoming exams: " + error.message);
        setUpcomingExams([]);
      }
    };

    if (currentUser) {
      fetchUpcomingExams();
    }
  }, [currentUser]);

  useEffect(() => {
    if (upcomingExams && upcomingExams.length > 0) {
      const timers = {};
      upcomingExams.forEach((exam) => {
        const examDate = new Date(exam.examDate).getTime();
        const now = new Date().getTime();
        if (examDate > now) {
          timers[exam._id] = examDate - now;
        } else {
          timers[exam._id] = 0;
        }
      });
      setTimeRemaining(timers);

      const interval = setInterval(() => {
        setTimeRemaining((prevTimers) => {
          const updatedTimers = {};
          upcomingExams.forEach((exam) => {
            const examDate = new Date(exam.examDate).getTime();
            const now = new Date().getTime();
            if (examDate > now) {
              updatedTimers[exam._id] = examDate - now;
            } else {
              updatedTimers[exam._id] = 0;
            }
          });
          return updatedTimers;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [upcomingExams]);

  const formatTime = (milliseconds) => {
    if (milliseconds <= 0) {
      return <span className="text-green-500 font-semibold">Exam Live!</span>;
    }
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return (
      <span className="font-mono">
        {days}d {hours % 24}h {minutes % 60}m {seconds % 60}s
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-wide border-b-4 border-purple-400 pb-3">
          <span className="text-purple-600 mr-2">🚀</span> Upcoming Exams
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {upcomingExams === null ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl text-gray-600 italic animate-pulse">⏳ Loading exams...</p>
          </div>
        ) : upcomingExams.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl text-gray-600 italic">🎉 No upcoming exams at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-purple-200"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 text-center">
                  <h3 className="text-2xl font-semibold tracking-wide">{exam.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    <span className="text-lg font-medium">{exam.description}</span>
                  </p>
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <span className="text-gray-900 font-semibold mr-2">⏳ Duration:</span>
                      <span className="font-mono">{exam.duration} minutes</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-900 font-semibold mr-2">🏛 Department:</span>
                      <span className="font-medium">{exam.department}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-900 font-semibold mr-2">🎓 Year:</span>
                      <span className="font-medium">{exam.year}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-900 font-semibold mr-2">📅 Scheduled:</span>
                      <span className="font-medium">
                        {new Date(exam.examDate).toLocaleDateString("en-GB")} at{" "}
                        {new Date(exam.examDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-900 font-semibold mr-2">⏰ Starts in:</span>
                      {formatTime(timeRemaining[exam._id] || 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <marquee behavior="scroll" direction="left" scrollamount="5" className="text-lg text-purple-600 font-semibold animate-pulse">
            ✨ Prepare well and ace your exams! Good luck! ✨
          </marquee>
        </div>
      </div>
    </div>
  );
}