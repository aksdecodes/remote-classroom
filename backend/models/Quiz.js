const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: [
        {
            question: String,
            options: [String],
            correctAnswer: String
        }
    ],
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    }
});

module.exports = mongoose.model("Quiz", quizSchema);