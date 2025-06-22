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
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 border-b-2 border-blue-300 pb-2">
        Upcoming Exams
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      {upcomingExams === null ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-gray-600 italic animate-pulse">Loading exams...</p>
        </div>
      ) : upcomingExams.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-gray-600 italic">No upcoming exams at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingExams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition p-5"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-2">{exam.title}</h3>
              <p className="text-sm text-gray-700 mb-4">{exam.description}</p>

              <ul className="text-sm space-y-1 text-gray-600">
                <li><strong className="text-gray-800">Duration:</strong> {exam.duration} minutes</li>
                <li><strong className="text-gray-800">Department:</strong> {exam.department}</li>
                <li><strong className="text-gray-800">Year:</strong> {exam.year}</li>
                <li>
                  <strong className="text-gray-800">Scheduled:</strong>{' '}
                  {new Date(exam.examDate).toLocaleDateString("en-GB")} at{" "}
                  {new Date(exam.examDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </li>
                <li>
                  <strong className="text-gray-800">Starts in:</strong>{' '}
                  {formatTime(timeRemaining[exam._id] || 0)}
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}