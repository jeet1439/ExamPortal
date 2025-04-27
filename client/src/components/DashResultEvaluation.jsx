import React, { useEffect, useState } from 'react';

const DashResultEvaluation = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/admin/exams-to-publish');
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handlePublish = async (examId) => {
    try {
      const response = await fetch(`/api/publish-result/${examId}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        alert('Result Published Successfully!');
        fetchExams(); // refresh the list
      } else {
        alert(data.message || 'Failed to publish');
      }
    } catch (error) {
      console.error('Error publishing result:', error);
      alert('Error publishing result');
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 overflow-hidden">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Pending Result Publication
        </h2>

        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full table-auto bg-white border border-gray-300 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr className="text-sm font-semibold leading-normal">
                <th className="py-4 px-6 text-center">Title</th>
                <th className="py-4 px-6 text-center">Department</th>
                <th className="py-4 px-6 text-center">Year</th>
                <th className="py-4 px-6 text-center">Students Appeared</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <tr
                    key={exam._id}
                    className="border-b border-gray-200 hover:bg-gradient-to-r from-blue-50 to-purple-50 hover:scale-105 transition-all duration-200 ease-in-out"
                  >
                    <td className="py-4 px-6 text-center font-medium">{exam.title}</td>
                    <td className="py-4 px-6 text-center font-medium">{exam.department}</td>
                    <td className="py-4 px-6 text-center font-medium">{exam.year}</td>
                    <td className="py-4 px-6 text-center font-medium">{exam.studentCount}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handlePublish(exam._id)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out"
                      >
                        Publish
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-500 text-lg">
                    No Exams Pending Publication
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashResultEvaluation;
