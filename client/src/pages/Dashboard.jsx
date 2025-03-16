import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import DashVerifyStudent from "../components/DashVerifyStudent";
import DashAddTeachers from "../components/DashAddTeachers";
import DashExamManagement from "../components/DashExamManagement";
import DashQuestionBank from "../components/DashQuestionBank";
import DashResultEvaluation from "../components/DashResultEvaluation.jsx";
import DashReports from "../components/DashReports";
import DashNotifications from "../components/DashNotifications";
import DashSettings from "../components/DashSettings";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [bgColor, setBgColor] = useState(localStorage.getItem("bgColor") || "#ffffff");
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);

  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
    localStorage.setItem("bgColor", bgColor);
  }, [bgColor]);

  // Apply dark mode globally
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const sections = [
    { id: "verifyStudent", label: "Student Verification", component: <DashVerifyStudent /> },
    { id: "addTeachers", label: "Add Teachers/Employees", component: <DashAddTeachers /> },
    { id: "examManagement", label: "Exam Management", component: <DashExamManagement /> },
    { id: "questionBank", label: "Question Bank Management", component: <DashQuestionBank /> },
    { id: "resultEvaluation", label: "Result & Evaluation Management", component: <DashResultEvaluation /> },
    { id: "reports", label: "Reports & Analytics", component: <DashReports /> },
    { id: "notifications", label: "Notifications & Communication", component: <DashNotifications /> },
    { id: "settings", label: "System Settings & Customization", component: <DashSettings bgColor={bgColor} setBgColor={setBgColor} darkMode={darkMode} setDarkMode={setDarkMode}/> },
  ];

  return (
    <div className={`p-6 min-h-screen transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className={`text-3xl font-bold text-center mb-6 ${darkMode ? "text-white" : "text-black"}`}>
        Admin Dashboard
      </h1>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={`/dashboard?tab=${section.id}`}
            className={`p-4 text-center font-semibold border rounded-md cursor-pointer transition 
            ${tab === section.id ? "bg-blue-600 text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-white text-black hover:bg-gray-200"}`}
          >
            {section.label}
          </Link>
        ))}
      </div>

      {/* Render Selected Section */}
      <div className={`p-6 shadow-md rounded-lg transition-all ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        {sections.find((section) => section.id === tab)?.component || <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>Select a section from above.</p>}
      </div>
    </div>
  );
}
