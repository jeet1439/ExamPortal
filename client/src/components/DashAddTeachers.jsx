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
    <div className="p-8 bg-white shadow-xl rounded-lg border border-gray-200 max-w-md mx-auto mt-12">
  <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Teacher</h2>

  <input
    type="email"
    placeholder="Enter Teacher Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  />

  <input
    type="text"
    placeholder="Set Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  />

  <button
    onClick={handleAddTeacher}
    className="w-full p-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
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
