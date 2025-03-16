import React, { useEffect, useState } from "react";

const DashVerifyStudent = () => {
  const [students, setStudents] = useState([]);

  // Fetch unverified students
  useEffect(() => {
    fetch("/api/admin/students/unverified") // Adjust the URL based on your backend
      .then((response) => response.json()) 
      .then((data) => {
        console.log("API Response:", data);
        setStudents(data.students || []);  // Ensure 'students' is always an array
      })
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  // Approve student
  const handleApprove = (id) => {
    fetch(`/api/admin/students/approve/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => response.json())
      .then(() => {
        setStudents((prev) => prev.filter((student) => student._id !== id));
      })
      .catch((error) => console.error("Error approving student:", error));
  };

  // Reject student
  const handleReject = (id) => {
    fetch(`/api/students/reject/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => response.json())
      .then(() => {
        setStudents((prev) => prev.filter((student) => student._id !== id));
      })
      .catch((error) => console.error("Error rejecting student:", error));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Verify Students</h2>
      {students.length === 0 ? (
        <p>No students pending verification.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Id-Proof</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="text-center">
                <td className="border p-2">{student.username}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">
                  <button>View</button>
                </td>
                <td className="border p-2">
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                    onClick={() => handleApprove(student._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => handleReject(student._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashVerifyStudent;
