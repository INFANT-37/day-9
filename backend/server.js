const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB (default port 27017)
mongoose
  .connect("mongodb+srv://infantug23it:zSBX6aj1w4gHMAzZ@cluster0.s5ayvak.mongodb.net/")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: Number,
  department: String,
  marks: Number,
});

const Student = mongoose.model("Student", studentSchema);

//
// CRUD Routes
//

// CREATE - Add new student
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - Get one student by rollNo
app.get("/students/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNo: req.params.rollNo });
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update student by rollNo
app.put("/students/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNo: req.params.rollNo },
      req.body,
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete student by rollNo
app.delete("/students/:rollNo", async (req, res) => {
  try {
    const result = await Student.findOneAndDelete({ rollNo: req.params.rollNo });
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggregation - Avg marks per department
app.get("/students/avg/department", async (req, res) => {
  try {
    const result = await Student.aggregate([
      {
        $group: {
          _id: "$department",
          avgMarks: { $avg: "$marks" },
        },
      },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
app.get("/", (req, res) => {
  res.send("🎓 Student Management API is running...");
});
// CREATE - Add new student
app.post("/students", async (req, res) => {
  try {
    req.body.rollNo = Number(req.body.rollNo); // Ensure numbers
    req.body.marks = Number(req.body.marks);

    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: "✅ Student added successfully!", student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});