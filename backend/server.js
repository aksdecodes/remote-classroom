require("dotenv").config();


const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// ✅ Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("API running");
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const contentRoutes = require("./routes/contentRoutes");
app.use("/api/content", contentRoutes);