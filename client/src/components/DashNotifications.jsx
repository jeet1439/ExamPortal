import React, { useState, useEffect } from "react";

export default function DashNotifications() {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [users, setUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let queryParams = new URLSearchParams();
        if (year) queryParams.append("year", year);
        if (department) queryParams.append("department", department);
        if (rollNo) queryParams.append("rollNo", rollNo);

        const response = await fetch(`/api/admin/email/users?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [year, department, rollNo]);

  const handleSendEmail = async () => {
    if (!subject) return alert("Subject cannot be empty!");
    if (!message) return alert("Message cannot be empty!");

    try {
      const response = await fetch("/api/admin/email/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users, subject, message }),
      });

      if (!response.ok) throw new Error("Failed to send emails");

      alert("Emails sent successfully!");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending emails", error);
      alert("Failed to send emails.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg backdrop-blur-md bg-opacity-80 border border-gray-700 text-white max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">Send Notifications</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select value={year} onChange={(e) => setYear(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400">
          <option value="">Select Year</option>
          {[1, 2, 3, 4].map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>

        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400">
          <option value="">Select Department</option>
          {["ME", "EE", "CE", "CSE", "ECE"].map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <input type="number" placeholder="Roll No (optional)" value={rollNo} onChange={(e) => setRollNo(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter Subject..."
        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 mb-4"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 mb-4"
        rows="4"
      ></textarea>

      <button
        onClick={handleSendEmail}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
        disabled={loading}
      >
        {loading ? "Sending..." : (
          <>
            Send <i className="fa-solid fa-paper-plane ml-2"></i>
          </>
        )}
      </button>
    </div>
  );
}
