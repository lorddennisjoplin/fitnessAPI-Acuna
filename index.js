require('dotenv').config(); // Load .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB database
const mongoURI = process.env.MONGO_URI;

if (mongoURI) {
    mongoose.connect(mongoURI)
        .then(() => console.log('Now connected to MongoDB Atlas.'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.warn("MONGO_URI not set in environment variables. Skipping DB connection.");
}

// Routes Middleware
const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

// Optional: Root route to help test deployment / Boodle
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is working" });
});

// Start server
const port = process.env.PORT || 4000;
if (require.main === module) {
    app.listen(port, () => {
        console.log(`API is now online on port ${port}`);
    });
}

module.exports = app;