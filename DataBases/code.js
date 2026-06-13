require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection failed");
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
        const { username, password, name } = req.body;

        if (!(username && password && name)) {
            return res.status(400).json({
                message: "Please provide name, username and password"
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name: name,
            email: username,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            SECRET_KEY
        );

        res.status(201).json({
            message: "User registered successfully",
            token: token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});