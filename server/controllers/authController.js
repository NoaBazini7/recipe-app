const userService = require("../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config({path: require('path').resolve(__dirname, '../.env')});


// Login logic
exports.login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await userService.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.json({success: true, token: token, user: user});
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

// Register logic
exports.register = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const existingUser = await userService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({message: "Username taken. Please choose another."});
        }

        await userService.createUser({username, email, password: password});

        res.status(201).json({success: true, message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};