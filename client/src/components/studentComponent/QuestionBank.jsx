import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function QuestionBank() {
  const { currentUser } = useSelector((state) => state.user);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        const response = await fetch("/api/student/question-bank", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error fetching question banks");
        }

        const filtered = Array.isArray(data)
          ? data.filter(
              (q) =>
                q.year === currentUser?.year &&
                q.department === currentUser?.department
            )
          : [];

        setQuestions(filtered);
      } catch (error) {
        console.error("Error fetching question banks:", error.message);
        setQuestions([]);
        setError("Something went wrong while loading your question banks.");
      }
    };

    if (currentUser) {
      fetchQuestionBanks();
    }
  }, [currentUser]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
  <h3 className="text-4xl font-bold text-gray-800 mb-8 border-b-4 border-teal-500 pb-3 shadow-sm">
     Question Bank
  </h3>

  {error && (
    <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-3 rounded-md mb-6">
      {error}
    </div>
  )}

  {questions === null ? (
    <p className="text-xl text-center text-gray-600 animate-pulse">
      Loading questions...
    </p>
  ) : questions.length === 0 ? (
    <p className="text-lg text-center text-gray-500">
      No question banks available for your department and year.
    </p>
  ) : (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <table className="min-w-full text-sm text-gray-800">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
          <tr>
            <th className="px-6 py-4 text-left">Year</th>
            <th className="px-6 py-4 text-left">Department</th>
            <th className="px-6 py-4 text-left">Content</th>
            <th className="px-6 py-4 text-center">File</th>
            <th className="px-6 py-4 text-center">Posted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {questions.map((q) => (
            <tr
              key={q._id}
              className="hover:bg-gray-100 transition-all duration-200"
            >
              <td className="px-6 py-4">{q.year}</td>
              <td className="px-6 py-4">{q.department}</td>
              <td className="px-6 py-4">{q.content || "No description"}</td>
              <td className="px-6 py-4 text-center">
                {q.file?.url ? (
                  <a
                    href={q.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 font-medium hover:underline"
                  >
                    View File
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No file</span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {q.createdAt ? formatDate(q.createdAt) : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
}
