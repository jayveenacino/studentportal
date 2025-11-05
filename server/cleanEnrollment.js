const mongoose = require("mongoose");
const AcceptedStudent = require("./models/AcceptedStudent");

mongoose.connect("mongodb://127.0.0.1:27017/student")
    .then(async () => {
        console.log("Connected to DB");

        const students = await AcceptedStudent.find();

        for (const student of students) {
            if (!student.enrollmentHistory || student.enrollmentHistory.length === 0) continue;

            let cleanedHistory = student.enrollmentHistory
                .filter(h => h && h.academicYear && h.semester)
                .map(h => ({
                    academicYear: h.academicYear.trim(),
                    semester: h.semester.trim(),
                    enrollmentStatus: h.enrollmentStatus?.trim() || "N/A",
                    dateEnlisted: h.dateEnlisted || "",
                    dateEnrolled: h.dateEnrolled || ""
                }));

            const seen = new Set();
            cleanedHistory = cleanedHistory.filter(h => {
                const key = `${h.academicYear}|${h.semester}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            const semOrder = { "1st Sem": 1, "2nd Sem": 2, "Summer": 3 };
            cleanedHistory.sort((a, b) => {
                const [ayStartA] = a.academicYear.split("/").map(Number);
                const [ayStartB] = b.academicYear.split("/").map(Number);
                if (ayStartA !== ayStartB) return ayStartB - ayStartA;
                return (semOrder[a.semester] || 99) - (semOrder[b.semester] || 99);
            });

            cleanedHistory = cleanedHistory.slice(0, 3);

            student.enrollmentHistory = cleanedHistory;
            await student.save();

            console.log(`Cleaned history for student ${student.domainEmail}`);
        }

        console.log("All students cleaned successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("DB connection error:", err);
        process.exit(1);
    });
