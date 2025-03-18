import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Rejister() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, validId: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("year", formData.year);
    formDataToSend.append("department", formData.department);
    formDataToSend.append("section", formData.section);
    formDataToSend.append("rollNo", formData.rollNo);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("validId", formData.validId);

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Registration data sent", data);
        setLoading(false);
        navigate('/');
      } else {
        console.error('Process Failure', data.message);
      }
    } catch (error) {
      console.log('Fill up details correctly', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Student Register Form</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block font-medium">Username</label>
          <input type="text" id="username" name="username" placeholder="Your name" required onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300" />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium">Email</label>
          <input type="email" id="email" name="email" placeholder="Your email" required onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300" />
        </div>


        <div>
          <label htmlFor="year" className="block font-medium">Year</label>
          <select id="year" name="year" required onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300">
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="department" className="block font-medium">Department</label>
          <select id="department" name="department" required onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300">
            <option value="">Select Department</option>
            {["ME", "EE", "CE", "CSE", "ECE"].map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="section" className="block font-medium">Section</label>
          <select id="section" name="section" required onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300">
            <option value="">Select Section</option>
            {["A1", "A2", "B1", "B2"].map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rollNo" className="block font-medium">University Roll</label>
          <input type="number" id="rollNo" name="rollNo" placeholder="University roll" required onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300" />
        </div>

        <div>
          <label htmlFor="validId" className="block font-medium">Upload College ID:</label>
          <input type="file" id="validId" name="validId" accept="image/*" onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300" />
          <p className="text-sm text-gray-500 mt-1">File must be less than 2MB.</p>
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">Enter a password</label>
          <input type="password" id='password' name='password' placeholder='Add a password' required onChange={handleChange} 
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <button type="submit" disabled={loading} 
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
