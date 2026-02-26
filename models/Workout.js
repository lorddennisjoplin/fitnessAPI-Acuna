const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: [true, 'Workout name is required']
    },
    duration: {
        type: String,
        required: [true, 'Workout duration is required']
    },
    status: {
        type: String,
        default: "Pending"
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Workout', workoutSchema);