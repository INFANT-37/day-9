require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const mongoUri="mongodb+srv://infantug23it:zSBX6aj1w4gHMAzZ@cluster0.s5ayvak.mongodb.net/";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 🔁 MongoDB Events (Optional)
mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));
mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));

// ✅ Mongoose Schema & Model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: Number, required: true, unique: true },
  department: { type: String, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
});

const Student = mongoose.model("Student", studentSchema);

// ------------------ CRUD ROUTES ------------------

// CREATE - Add student
app.post("/students", async (req, res) => {
  try {
    const student = new Student({
      ...req.body,
      rollNo: Number(req.body.rollNo),
      marks: Number(req.body.marks),
    });
    await student.save();
    res.status(201).json({ message: "✅ Student added!", student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "❌ Roll number already exists" });
    }
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
    if (!student) return res.status(404).json({ message: "❌ Not found" });
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
    if (!student) return res.status(404).json({ message: "❌ Not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete student by rollNo
app.delete("/students/:rollNo", async (req, res) => {
  try {
    const result = await Student.findOneAndDelete({ rollNo: req.params.rollNo });
    if (!result) return res.status(404).json({ message: "❌ Not found" });
    res.json({ message: "✅ Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AGGREGATION - Avg marks per department
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

// Root Route
app.get("/", (req, res) => {
  res.send("🎓 Student Management API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Server running at http://localhost:${PORT}');
});