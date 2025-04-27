import React, { useState } from "react";

export default function DashAddTeachers() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTeacher = async () => {
    if (!email || !username) return alert("Please enter all details!");

    setLoading(true);
    try {
      const response = await fetch("/api/admin/add-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error adding teacher", error);
      alert("Failed to add teacher");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto mt-10"> 
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Add Teacher</h2>
      
      <input
        type="email"
        placeholder="Enter Teacher Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all mb-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
      />

      <input
        type="text"
        placeholder="Set Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all mb-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
      />

      <button
        onClick={handleAddTeacher}
        className="w-full p-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <span className="animate-pulse">Adding...</span>
        ) : (
          <>
            <i className="fa-solid fa-user-plus"></i> Add Teacher
          </>
        )}
      </button>
    </div>
  );
}
