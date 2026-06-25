require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });

const User = mongoose.model('Users', {
    name: String,
    email: String,
    password: String
});

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the homepage"
    });
});

app.post("/signup", async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!(name && username && password)) {
            return res.status(400).json({
                message: "Please provide all fields"
            });
        }

        const existingUser = await User.findOne({
            email: username
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        //const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name: name,
            email: username,
            password: password
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            email: username
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        //const isMatch = await bcrypt.compare(password, user.password);

        // if (!isMatch) {
        //     return res.status(400).json({
        //         message: "Incorrect password"
        //     });
        // }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.email
            },
            SECRET_KEY
        );

        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // -password is used to hide the password field.

        res.json({
            users: users
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});