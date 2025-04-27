import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashVerifyStudent = () => {
  const [students, setStudents] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  // Fetch unverified students
  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      fetch("/api/admin/students/unverified")
        .then((res) => res.json())
        .then((data) => setStudents(data))
        .catch((err) => console.error("Error fetching students:", err));
    }
  }, [currentUser]);

  // Approve student
  const handleApprove = (id) => {
    fetch(`/api/admin/students/approve/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setStudents((prev) => prev.filter((student) => student._id !== id));
      })
      .catch((err) => console.error("Error approving student:", err));
  };

  // Reject student
  const handleReject = (id) => {
    fetch(`/api/admin/students/reject/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setStudents((prev) => prev.filter((student) => student._id !== id));
      })
      .catch((err) => console.error("Error rejecting student:", err));
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
                {student.validId && (
                    <a
                      href={student.validId.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View ID
                    </a>
                  )}
                </td>
                <td className="border p-2">
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                    onClick={() => handleApprove(student._id)}
                  >
                    Approve <i className="fa-solid fa-check"></i>
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => handleReject(student._id)}
                  >
                    Reject <i className="fa-solid fa-xmark"></i>
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
