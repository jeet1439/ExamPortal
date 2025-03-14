import React from "react";
import { FaUserGraduate, FaUserShield } from "react-icons/fa";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Exam Portal</h1>
      <p className="text-lg text-gray-600 mb-6">
        Choose your login option below to proceed.
      </p>
      <div className="flex space-x-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md">
          <FaUserGraduate className="text-xl" /> Login as Student
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md">
          <FaUserShield className="text-xl" /> Login as Admin
        </button>
      </div>
    </div>
  );
}