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
    <div className="p-6 bg-gray-100 dark:bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Teacher</h2>

      <input
        type="email"
        placeholder="Enter Teacher Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="text"
        placeholder="Set Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <button
        onClick={handleAddTeacher}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? (
          "Adding..."
        ) : (
          <>
            <i class="fa-solid fa-user-plus"></i> Add Teacher
          </>
        )}
      </button>
    </div>
  );
}
