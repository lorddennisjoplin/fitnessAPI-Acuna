const Workout = require("../models/Workout");
const { errorHandler } = require('../auth');

module.exports.addWorkout = (req, res) => {
    let newWorkout = new Workout({
        userId: req.user.id,
        name : req.body.name,
        duration : req.body.duration,
    });

    Workout.findOne({ name: req.body.name })
    .then(existingWorkout => {
        if(existingWorkout){
            return res.status(409).send({ message: 'Workout already exists.'});
        } else {
            return newWorkout.save()
            .then(result => res.status(201).send(result))
            .catch(error => errorHandler(error,req,res));
        }
    })
    .catch(error => errorHandler(error, req, res));
}; 

module.exports.getMyWorkouts = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    return Workout.find({ userId: req.user.id })
        .then(result => {
            if (result.length > 0) {
                return res.status(200).json({ workouts: result });
            } else {
                return res.status(404).json({ message: 'No workouts found.' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


module.exports.getSpecificWorkout = (req, res) => {
    return Workout.findById(req.params.workoutId)
        .then(workout => {
            if (!workout) return res.status(404).json({ message: "Workout not found" });
            return res.status(200).json(workout); // return directly
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.updateWorkout = (req, res) => {

    const updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration
    };

    return Workout.findOneAndUpdate(
        { _id: req.params.workoutId, userId: req.user.id },
        updatedWorkout,
        { new: true, runValidators: true }
    )
    .then(workout => {
        if (workout) {
            return res.status(200).json({
                message: "Workout updated successfully",
                updatedWorkout: workout
            });
        } else {
            return res.status(404).json({
                message: "Workout not updated"
            });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.completeWorkout = (req, res) => {

    if (!req.params.workoutId) {
        return res.status(400).json({ success: false, message: "Workout ID is required" });
    }

    return Workout.findOneAndUpdate(
        { _id: req.params.workoutId, userId: req.user.id },
        { status: "Completed" },
        { new: true }
    )
    .then(workout => {
        if (workout) {
            return res.status(200).json({
                message: "Workout status updated successfully",
                updatedWorkout: workout
            });
        } else {
            return res.status(404).json({
                message: "Workout status not updated"
            });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteWorkout = (req, res) => {

    return Workout.findOneAndDelete({ _id: req.params.workoutId, userId: req.user.id })
        .then(workout => {
            if (workout) {
                return res.status(200).json({
                    message: "Workout deleted successfully"
                });
            } else {
                return res.status(404).json({
                    message: "Workout not found or deleted"
                });
            }
        })
        .catch(error => errorHandler(error, req, res));
};