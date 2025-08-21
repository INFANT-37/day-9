import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", rollNo: "", department: "", marks: "" });
  const [message, setMessage] = useState("");

  // For update modal
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", rollNo: "", department: "", marks: "" });

  // Fetch all students
  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/students", form);
      setMessage(res.data.message);
      fetchStudents();
      setForm({ name: "", rollNo: "", department: "", marks: "" });
    } catch (err) {
      setMessage("❌ Error: " + err.response.data.error);
    }
  };

  // Delete student
  const handleDelete = async (rollNo) => {
    await axios.delete(`http://localhost:5000/students/${rollNo}`);
    setMessage("🗑️ Student deleted successfully!");
    fetchStudents();
  };

  // Open update modal
  const openUpdateDialog = (student) => {
    setEditing(student.rollNo);
    setEditForm({ ...student });
  };

  // Handle update form submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/students/${editing}`, editForm);
    setMessage("✏️ Student updated successfully!");
    setEditing(null); // close modal
    fetchStudents();
  };

  return (
    <div className="app-container">
      <h1>🎓 Student Management</h1>

      {message && <p style={{ color: "green", marginBottom: "15px" }}>{message}</p>}

      <form onSubmit={handleSubmit} className="add-form">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Roll No" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <input placeholder="Marks" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} />
        <button type="submit">Add Student</button>
      </form>

      <ul>
        {students.map((s) => (
          <li key={s._id}>
            <span className="student-info">
              {s.name} ({s.rollNo}) - {s.department}
            </span>
            <span className="student-marks">{s.marks} marks</span>
            <div>
              <button onClick={() => openUpdateDialog(s)}>Update</button>
              <button onClick={() => handleDelete(s.rollNo)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Update Modal */}
      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Student</h2>
            <form onSubmit={handleUpdateSubmit}>
              <input
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <input
                placeholder="Roll No"
                value={editForm.rollNo}
                onChange={(e) => setEditForm({ ...editForm, rollNo: e.target.value })}
              />
              <input
                placeholder="Department"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              />
              <input
                placeholder="Marks"
                value={editForm.marks}
                onChange={(e) => setEditForm({ ...editForm, marks: e.target.value })}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
