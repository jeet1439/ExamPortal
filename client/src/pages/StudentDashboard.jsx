import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function StudentDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dummy exam data (replace with API data)
  const exams = [
    { subject: "Mathematics", date: "2025-03-25", time: "10:00 AM" },
    { subject: "Physics", date: "2025-03-28", time: "2:00 PM" },
    { subject: "Computer Science", date: "2025-04-02", time: "11:00 AM" },
  ];


  const handleStartExam = (examSubject) => {
    alert(`Starting the ${examSubject} exam...`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Full-width Clock */}
      <div className="w-full bg-blue-600 text-white p-4 flex justify-between items-center text-2xl font-semibold shadow-lg rounded-sm">
  <span>{time.toLocaleTimeString()}</span>
  <h2 className="text-xl">Welcome, {currentUser ? currentUser.username : "Student"}!</h2>
</div>

      {/* Exams Section */}
      <div className="w-full mt-8">
        <h3 className="text-xl font-semibold mb-4">Upcoming Exams</h3>
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
          {exams.length > 0 ? (
            <ul>
              {exams.map((exam, index) => (
                <li
                  key={index}
                  className="p-3 border-b last:border-none flex justify-between items-center"
                >
                  <span className="font-medium">{exam.subject}</span>
                  <span>{exam.date} at {exam.time}</span>
                  {/* Start Exam Button */}
                  <button
                    onClick={() => handleStartExam(exam.subject)}
                    className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
                  >
                    Start Exam
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming exams.</p>
          )}
        </div>
      </div>
    </div>
  );
}
