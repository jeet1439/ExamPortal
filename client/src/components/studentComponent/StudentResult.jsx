import React, { useEffect, useState } from 'react';

export default function StudentResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/student/results', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
 
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching student results:', error);
        setErrorMsg('Failed to load results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="px-4 py-6 min-h-screen bg-gradient-to-r from-green-100 to-blue-200">
      <div className="max-w-4xl mx-auto bg-stone-50 rounded-3xl shadow-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6">
          Exam Results
        </h1>

        {loading ? (
          <p className="text-center text-gray-600 text-base">Loading...</p>
        ) : errorMsg ? (
          <p className="text-center text-red-600 text-base">{errorMsg}</p>
        ) : results.length === 0 ? (
          <p className="text-center text-gray-500 text-base">No results found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm sm:text-base border-collapse">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-center whitespace-nowrap">Exam Title</th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">Date</th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">Marks</th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.examId} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4 text-center">{result.examTitle}</td>
                    <td className="py-3 px-4 text-center">
                      {new Date(result.examDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">{result.marksObtained}</td>
                    <td className="py-3 px-4 text-center">{result.totalMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
