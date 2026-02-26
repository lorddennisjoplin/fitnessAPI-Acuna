const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth.js');

const { errorHandler } = require('../auth');

module.exports.registerUser = async (req, res) => {
    try {
        // Validate email
        if (!req.body.email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format."
            });
        }

        // Validate password length
        if (req.body.password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Create new user
        const newUser = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        const savedUser = await newUser.save();
        return res.status(201).json({
            message: "Registered successfully.",
            userId: savedUser._id
        });

    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){

       return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                // Send status 404
                return res.status(404).send(false);
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {

                    //Send status 200
                    return res.status(200).send({ access : auth.createAccessToken(result)})
                } else {

                    //Send status 401
                    return res.status(401).send(false);
                }
            }
        })
        .catch(error => errorHandler(error, req, res)); 
    } else {
        return res.status(400).send(false)
    }
};

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .select("-password")   // exclude password
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found." });
            return res.status(200).json({ user });
        })
        .catch(error => errorHandler(error, req, res));
};