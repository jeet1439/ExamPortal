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
    <div className="min-h-screen bg-gradient-to-br from-[#1b1f38] to-[#232946] p-8">
      <h2 className="text-3xl font-bold text-[#e0e6ed] mb-6 border-b-2 border-[#00c6a7] pb-2 shadow-md">
        📘 Your Question Bank
      </h2>

      {error && (
        <p className="text-red-400 bg-red-900/30 p-3 rounded-md border border-red-500 mb-4 shadow-sm">
          {error}
        </p>
      )}

      {questions === null ? (
        <p className="text-lg text-[#aeb6c3] text-center animate-pulse">
          ⏳ Loading your content...
        </p>
      ) : questions.length === 0 ? (
        <p className="text-lg text-[#9aa3b2] text-center">
          📂 No question banks available for your department and year.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg">
          <table className="min-w-full text-sm text-[#e0e6ed] border border-[#4c597a] rounded-lg">
            <thead className="bg-[#2a2e45] text-[#00c6a7] uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">📆 Year</th>
                <th className="px-6 py-4 text-left">🏛 Department</th>
                <th className="px-6 py-4 text-left">📝 Content</th>
                <th className="px-6 py-4 text-center">📄 File</th>
                <th className="px-6 py-4 text-center">📅 Date Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a415b] bg-[#1e2136]">
              {questions.map((q) => (
                <tr key={q._id} className="hover:bg-[#2d314a] transition-all duration-300">
                  <td className="px-6 py-4">{q.year}</td>
                  <td className="px-6 py-4">{q.department}</td>
                  <td className="px-6 py-4">{q.content || "No description"}</td>
                  <td className="px-6 py-4 text-center">
                    {q.file?.url ? (
                      <a
                        href={q.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00c6a7] font-medium hover:underline"
                      >
                        View File
                      </a>
                    ) : (
                      <span className="text-gray-500 italic">No file</span>
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
