const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

// Path to the JSON file where data will be stored
const dataFilePath = "./data/students.json";

// Utility function to read the JSON file
const readDataFromFile = () => {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
};

// Utility function to write data to the JSON file
const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// CRUD Operations

// 1. CREATE a new student
app.post("/students", (req, res) => {
    const students = readDataFromFile();
    const newStudent = {
        id: students.length ? students[students.length - 1].id + 1 : 1,
        name: req.body.name,
        age: req.body.age,
        grade: req.body.grade,
    };
    students.push(newStudent);
    writeDataToFile(students);
    res.status(201).json(newStudent);
});

// 2. READ all students
app.get("/students", (req, res) => {
    const students = readDataFromFile();
    res.json(students);
});

// 3. READ a student by ID
app.get("/students/:id", (req, res) => {
    const students = readDataFromFile();
    const student = students.find((s) => s.id === parseInt(req.params.id));
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

// 4. UPDATE a student by ID
app.put("/students/:id", (req, res) => {
    const students = readDataFromFile();
    const studentIndex = students.findIndex(
        (s) => s.id === parseInt(req.params.id)
    );
    if (studentIndex !== -1) {
        const updatedStudent = {
            ...students[studentIndex],
            name: req.body.name || students[studentIndex].name,
            age: req.body.age || students[studentIndex].age,
            grade: req.body.grade || students[studentIndex].grade,
        };
        students[studentIndex] = updatedStudent;
        writeDataToFile(students);
        res.json(updatedStudent);
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

// 5. DELETE a student by ID
app.delete("/students/:id", (req, res) => {
    const students = readDataFromFile();
    const filteredStudents = students.filter(
        (s) => s.id !== parseInt(req.params.id)
    );
    if (students.length === filteredStudents.length) {
        res.status(404).json({ message: "Student not found" });
    } else {
        writeDataToFile(filteredStudents);
        res.status(204).send();
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
