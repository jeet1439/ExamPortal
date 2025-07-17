import React from "react";
import { FaUserGraduate, FaUserShield } from "react-icons/fa";
import { Link } from "react-router-dom";
import heroVideo from "../components/video/heroVideo.mp4";

// Import a local video (optional)
// import heroVideo from "../assets/your-video.mp4";

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        {/* Use local file or external URL */}
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken the video for readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center text-white p-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Exam Portal</h1>
        <p className="text-lg mb-6">
          Choose your login option below to proceed.
        </p>

        <div className="flex space-x-4">
          <Link to="/student-login">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">
              <FaUserGraduate className="text-xl" /> Login as Student
            </button>
          </Link>
          <Link to="/admin-login">
            <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl shadow-md">
              <FaUserShield className="text-xl" /> Login as Admin
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
