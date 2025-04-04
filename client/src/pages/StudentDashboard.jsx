import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import StudentResult from "../components/studentComponent/StudentResult";
import UpcomingExams from "../components/studentComponent/UpcomingExams";
import LiveExams from "../components/studentComponent/LiveExams";
import Notifications from "../components/studentComponent/Notifications";
import QuestionBank from "../components/studentComponent/QuestionBank";

export default function StudentDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const sections = [
    { id: "liveExams", label: "Live Exams", component: <LiveExams /> },
    { id: "results", label: "Results", component: <StudentResult/> },
    { id: "upcomingExams", label: "Upcoming Exams", component: <UpcomingExams /> },
    { id: "notifications", label: "Notifications", component: <Notifications /> },
    { id: "questionBank", label: "Question Bank", component: <QuestionBank /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section with Clock & Welcome Message */}
      <div className="w-full bg-blue-600 text-white p-4 flex justify-between items-center text-2xl font-semibold shadow-lg rounded-md">
        <span>{time.toLocaleTimeString()}</span>
        <h2 className="text-xl">Welcome, {currentUser ? currentUser.username : "Student"}!</h2>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={`/student-dashboard?tab=${section.id}`}
            className={`p-4 text-center font-semibold border rounded-md cursor-pointer transition 
            ${tab === section.id ? "bg-blue-600 text-white" : "bg-white text-black hover:bg-gray-200"}`}
          >
            {section.label}
          </Link>
        ))}
      </div>
      <hr />

      {/* Render Selected Tab */}
      <div className="p-6 shadow-md rounded-lg bg-white">
        {sections.find((section) => section.id === tab)?.component || <p className="text-gray-700">Select a section from above.</p>}
      </div>
    </div>
  );
}
