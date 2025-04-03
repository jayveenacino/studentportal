const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const StudentModel = require("./models/Student");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

mongoose.connect("mongodb://127.0.0.1:27017/student", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post('/register', async (req, res) => {
    try {
        const studentNumber = Math.random() * 1000000;

        const student = await StudentModel.create({ ...req.body, studentNumber });
        res.status(201).json({ message: "Account created successfully", student });
    } catch (err) {
        res.status(500).json({ message: "Error creating account", error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await StudentModel.findOne({ email, password });

        if (!student) {
            throw new Error("Invalid email or password");
        }

        res.status(201).json({ message: "Account successfully logged in", student });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});

app.get("/students", async (req, res) => {
    try {
        const students = await StudentModel.find({}, "firstname middlename lastname");
        res.json(students);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


const fetchStudents = async () => {
    try {
        const response = await axios.get("http://localhost:2025/students");
        console.log("Fetched Students:", response.data);
    } catch (error) {
        console.error("Error fetching students:", error.message);
    }
};


app.post('/upload', async (req, res) => {
    try {
        const { email, image } = req.body; // Get email and base64 image

        if (!email || !image) {
            return res.status(400).json({ message: "Email and image are required" });
        }

        const student = await StudentModel.findOneAndUpdate(
            { email },
            { image },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Image uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


setInterval(fetchStudents, 5000);

app.listen(2025, () => {
    console.log("Server is running on port 2025");
});