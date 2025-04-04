import { useState, useEffect } from "react";

const departments = ["ME", "EE", "CE", "CSE", "ECE"];
const years = [1, 2, 3, 4];

export default function CreateExam() {
  const [exam, setExam] = useState({
    title: "",
    description: "",
    department: "",
    year: "",
    duration: "",
    questions: [],
    examDate: ""
  });
  const [exams, setExams] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errMsg) {
      const timer = setTimeout(() => setErrMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errMsg]);

  useEffect(() => {
    fetch("/api/admin/exam/get-all")
      .then(res => res.json())
      .then(data => setExams(data))
      .catch(error => console.error("Error fetching exams:", error));
  }, []);

  const addQuestion = () => {
    setExam(prev => ({
      ...prev,
      questions: [...prev.questions, { question: "", options: ["", "", "", ""], correctAnswer: "", marks: "" }]
    }));
  };

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index][field] = value;
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/admin/exam/add-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(exam)
      });

      if (response.ok) {
        setSuccessMsg('Exam Created Successfully!');
        setExam({ title: "", description: "", department: "", year: "", duration: "", questions: [] });
      } else {
        setErrMsg('Error creating the exam!');
      }
    } catch (error) {
      console.log(error);
      setErrMsg('Error creating the exam!');
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/admin/exam/deleteExam/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (response.ok) {
      setSuccessMsg('Exam Deleted Successfully!');
      setExams(exams.filter(exam => exam._id !== id));
    } else {
      console.log(response);
      setErrMsg("Error deleting exam");
    }
  };

  const handleLive = async (id, currentStatus) => {
    const newStatus = !currentStatus; // Toggle boolean value
    const response = await fetch(`/api/admin/exam/liveExam/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ isLive: newStatus }) // Send boolean instead of string
    });

    if (response.ok) {
      setSuccessMsg(`Exam is now ${newStatus ? "Live" : "Unlive"}`);
      setExams(exams.map(exam =>
        exam._id === id ? { ...exam, isLive: newStatus } : exam
      ));
    } else {
      setErrMsg("Error changing exam status");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">📝 Create an Exam</h2>

      <div className="space-y-6">
        <input className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400" placeholder="Exam Title"
          value={exam.title} onChange={e => setExam({ ...exam, title: e.target.value })} />

        <textarea className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400" placeholder="Description"
          value={exam.description} onChange={e => setExam({ ...exam, description: e.target.value })} />

        <select className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400" onChange={e => setExam({ ...exam, department: e.target.value })}>
          <option value="">Select Department</option>
          {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
        </select>

        <select className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400" onChange={e => setExam({ ...exam, year: e.target.value })}>
          <option value="">Select Year</option>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>

        <input className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400" type="number" placeholder="Duration (minutes)" value={exam.duration} onChange={e => setExam({ ...exam, duration: e.target.value })} />
        <input className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400" type="datetime-local" value={exam.examDate} onChange={e => setExam({ ...exam, examDate: e.target.value })} />
        
        {exam.questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded-xl shadow-md bg-gray-50 space-y-3">
            <input className="w-full p-3 border rounded-xl shadow-sm" placeholder="Question" value={q.question} onChange={e => handleChange(qIndex, "question", e.target.value)} />
            {q.options.map((opt, oIndex) => (
              <input key={oIndex} className="w-full p-3 border rounded-xl shadow-sm" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} />
            ))}
            <input className="w-full p-3 border rounded-xl shadow-sm" placeholder="Correct Answer" value={q.correctAnswer} onChange={e => handleChange(qIndex, "correctAnswer", e.target.value)} />
            <input className="w-full p-3 border rounded-xl shadow-sm" type="number" placeholder="Marks" value={q.marks} onChange={e => handleChange(qIndex, "marks", e.target.value)} />
          </div>
        ))}

        <div className="flex justify-between">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-md hover:scale-105 transition-transform" onClick={addQuestion}>+ Add Question</button>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-md hover:scale-105 transition-transform" type="submit" onClick={handleSubmit}>Create Exam</button>
        </div>
      </div>

      <div className="mt-10">
        {exams.length === 0 ? (
          <p className="p-6 text-center text-lg text-gray-600 bg-gray-100 rounded-lg shadow">No exams created</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 pb-2 mb-6">📅 Scheduled Exams</h2>
            <ul className="space-y-4">
              {exams.map(exam => (
                <li key={exam._id} className="p-6 bg-white shadow-lg rounded-xl flex items-center justify-between border hover:shadow-xl transition-all">
                  <span className="text-lg font-medium text-gray-700">
                    {exam.title} - <span className="text-blue-600">{exam.department}</span> (Year {exam.year})
                  </span>

                  <div className="flex items-center gap-3">
                    <button className={`px-4 py-2 font-semibold text-white rounded-xl shadow-md transition-all ${exam.isLive ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"}`} onClick={() => handleLive(exam._id, exam.isLive)}>
                      {exam.isLive ? "Unlive" : "Live"}
                    </button>

                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md" onClick={() => handleDelete(exam._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {successMsg && (
          <p className="mt-4 text-center text-green-600 font-medium bg-green-100 p-3 rounded-lg shadow">
            {successMsg}
          </p>
        )}

        {errMsg && (
          <p className="mt-4 text-center text-red-600 font-medium bg-red-100 p-3 rounded-lg shadow">
            {errMsg}
          </p>
        )}
      </div>
    </div>
  );
}
