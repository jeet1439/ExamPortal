import React, { useEffect, useState } from 'react';

const StudentResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentResults();
  }, []);

  const fetchStudentResults = async () => {
    try {
      const response = await fetch('/api/student/results'); // Replace with your backend route
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching student results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (examId) => {
    try {
      const response = await fetch(`/api/student/certificate/${examId}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificate.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to generate certificate.');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Something went wrong while generating certificate.');
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-green-100 to-blue-200 overflow-hidden">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          My Exam Results
        </h2>

        {loading ? (
          <p className="text-center text-lg text-gray-600">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No published results available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-center">Exam Title</th>
                  <th className="py-3 px-4 text-center">Date</th>
                  <th className="py-3 px-4 text-center">Marks</th>
                  <th className="py-3 px-4 text-center">Total</th>
                  <th className="py-3 px-4 text-center">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.examId} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-center">{result.examTitle}</td>
                    <td className="py-3 px-4 text-center">{new Date(result.examDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-center">{result.marksObtained}</td>
                    <td className="py-3 px-4 text-center">{result.totalMarks}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleGenerateCertificate(result.examId)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
                      >
                        Generate Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResult;
