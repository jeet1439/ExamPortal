import React, { useState, useEffect } from "react";

const DashQuestionBank = () => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  const [userUploadedQuestions, setUserUploadedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestionBank();
    fetchMyUploads();
  }, []);

  const fetchQuestionBank = async () => {
    try {
      const response = await fetch("/api/admin/question-bank", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUploadedQuestions(data);
    } catch (error) {
      console.error("Error fetching question bank:", error);
    }
  };

  const fetchMyUploads = async () => {
    try {
      const response = await fetch("/api/admin/question-bank", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUserUploadedQuestions(data);
    } catch (error) {
      console.error("Error fetching your question banks:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question bank?")) return;

    try {
      const response = await fetch(`/api/admin/question-bank/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete question bank");

      alert("Question bank deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting question bank:", error);
      alert("Failed to delete question bank.");
    }
  };

  const handlePostQuestion = async () => {
    if (!year || !department || (!message && !file)) {
      return alert("Please provide either a message or a file!");
    }

    const formData = new FormData();
    formData.append("year", year);
    formData.append("department", department);
    if (message) formData.append("content", message);
    if (file) formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("/api/admin/question-bank", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to post question bank");

      alert("Question Bank posted successfully!");
      setYear("");
      setDepartment("");
      setMessage("");
      setFile(null);
      fetchQuestionBank();
      fetchMyUploads();
    } catch (error) {
      console.error("Error posting question bank", error);
      alert("Failed to post question bank.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white via-blue-50 to-purple-100 shadow-xl rounded-2xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700">📚 Upload Question Bank</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">🎓 Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-3 border rounded-lg bg-white shadow-sm">
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">🏢 Department:</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full p-3 border rounded-lg bg-white shadow-sm">
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EE">EE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">📝 Content:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border rounded-lg bg-white shadow-sm"
          rows="4"
        ></textarea>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">📁 Upload File: (.jpg, .jpeg, .png, .pdf, .docx)</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.docx"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-lg bg-white shadow-sm"
        />
      </div>

      <div className="mt-6">
        <button
          onClick={handlePostQuestion}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
        >
          {loading ? "Uploading..." : "🚀 Upload"}
        </button>
      </div>

      <h3 className="text-2xl font-bold mt-10 mb-4 text-gray-800">📂 Your Uploaded Question Banks</h3>

      {userUploadedQuestions.length === 0 ? (
        <p className="text-gray-500 text-lg">No question banks uploaded yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Year</th>
                <th className="px-6 py-3 font-semibold">Content</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userUploadedQuestions.map((q) => (
                <tr key={q._id} className="hover:bg-gray-100 transition duration-200">
                  <td className="px-6 py-4 text-gray-700">{q.department}</td>
                  <td className="px-6 py-4 text-gray-700">{q.year}</td>
                  <td className="px-6 py-4 text-gray-700">{q.content || "No content"}</td>
                  <td className="px-6 py-4 flex items-center justify-center gap-3">
                    {q.file.url && (
                      <a
                        href={q.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow transition duration-200"
                      >
                        View
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md shadow transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashQuestionBank;
