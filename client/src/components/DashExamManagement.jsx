import { useState, useEffect } from "react";

const departments = ["ME", "EE", "CE", "CSE", "ECE"];
const years = [1, 2, 3, 4, 5];

export default function CreateExam() {
  const [exam, setExam] = useState({
    title: "",
    description: "",
    department: "",
    year: "",
    duration: "",
    questions: []
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
      setErrMsg("Error deleting exam");
    }
  };

  return (
    <>
      <div className="p-6 space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Exam Title" 
        value={exam.title} onChange={e => setExam({ ...exam, title: e.target.value })} />

        <textarea className="w-full p-2 border rounded" placeholder="Description" 
        value={exam.description} onChange={e => setExam({ ...exam, description: e.target.value })} />

        <select className="w-full p-2 border rounded" onChange={e => setExam({ ...exam, department: e.target.value })}>
          <option value="">Select Department</option>
          {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
        </select>

        <select className="w-full p-2 border rounded" onChange={e => setExam({ ...exam, year: e.target.value })}>
          <option value="">Select Year</option>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>

        <input className="w-full p-2 border rounded" type="number" placeholder="Duration (minutes)" value={exam.duration} onChange={e => setExam({ ...exam, duration: e.target.value })} />

        {exam.questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded space-y-2">
            <input className="w-full p-2 border rounded" placeholder="Question" value={q.question} onChange={e => handleChange(qIndex, "question", e.target.value)} />
            {q.options.map((opt, oIndex) => (
              <input key={oIndex} className="w-full p-2 border rounded" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} />
            ))}
            <input className="w-full p-2 border rounded" placeholder="Correct Answer" value={q.correctAnswer} onChange={e => handleChange(qIndex, "correctAnswer", e.target.value)} />
            <input className="w-full p-2 border rounded" type="number" placeholder="Marks" value={q.marks} onChange={e => handleChange(qIndex, "marks", e.target.value)} />
          </div>
        ))}
        <div className="flex flex-row justify-between">
          <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={addQuestion}>+Add Question</button>
          <button className="mt-4 p-2 bg-green-500 text-white rounded" onClick={handleSubmit}>Create Exam</button>
        </div>
      </div>
      <div className="mt-8">
        {
          exams.length === 0 ?
            (<p className="p-4">No exams created</p>) :
            (
              <>
                <h2 className="text-xl p-4 mb-10 font-semibold">Scheduled Exams</h2>
                <ul>
                  {exams.map(exam => (
                    <li key={exam._id} className="p-4 border rounded flex justify-between">
                      <span>{exam.title} - {exam.department} (Year {exam.year})</span>
                      <button className="p-2 bg-red-500 text-white rounded" onClick={() => handleDelete(exam._id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </>
            )
        }
        {successMsg ? (<p className="text-green-500 mt-3">{successMsg}</p>) : ''}
        {errMsg ? (<p className="text-red-500 mt-3">{errMsg}</p>) : ''}
      </div>
    </>
  );
}
