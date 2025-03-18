import React, { useState, useEffect } from "react";

export default function DashNotifications() {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [users, setUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch users based on filters
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

  // Handle sending email
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
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold mb-4 text-center">Send Notifications</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border rounded">
          <option value="">Select Year</option>
          {[1, 2, 3, 4].map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>

        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="p-2 border rounded">
          <option value="">Select Department</option>
          {["ME", "EE", "CE", "CSE", "ECE"].map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <input type="number" placeholder="Roll No (optional)" value={rollNo} onChange={(e) => setRollNo(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Subject Input */}
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter Subject of Your mail.."
        className="w-full p-2 border rounded mb-4"
      />

      {/* Message Input */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="w-full p-2 border rounded mb-4"
        rows="4"
      ></textarea>

      {/* Send Button */}
      <button
        onClick={handleSendEmail}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Email"}
      </button>
    </div>
  );
}
