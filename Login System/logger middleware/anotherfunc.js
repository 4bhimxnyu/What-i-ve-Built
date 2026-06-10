const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const app = express();

app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

// Temporary database
let users = [];


// Zod Schema
const registerSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6)
});


// Register
app.post("/register", async (req, res, next) => {

    try {

        // Validate body
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {

            const err = new Error(
                result.error.issues[0].message
            );

            err.statusCode = 400;

            throw err;
        }

        const { username, password } = req.body;

        // Check existing user
        const existingUser = users.find(
            user => user.username === username
        );

        if (existingUser) {

            const err = new Error(
                "User already exists"
            );

            err.statusCode = 409;

            throw err;
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        users.push({
            username,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully"
        });

    }
    catch (err) {

        next(err);

    }
 
});

// Login

app.post("/login", async (req, res, next) => {

    try {

        const { username, password } = req.body;

        const user = users.find(
            user => user.username === username
        );

        if (!user) {

            const err = new Error(
                "User not found"
            );

            err.statusCode = 404;

            throw err;
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            const err = new Error(
                "Invalid credentials"
            );

            err.statusCode = 401;

            throw err;
        }

        const token = jwt.sign(
            {
                username: user.username
            },
            SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    }
    catch (err) {

        next(err);

    }

});


// Auth Middleware

function auth(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {

            const err = new Error(
                "No token provided"
            );

            err.statusCode = 401;

            throw err;
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                SECRET_KEY
            );

        req.user = decoded;

        next();

    }
    catch (err) {

        next(err);

    }

}


// Protected Route

app.get(
    "/profile",
    auth,
    (req, res) => {

        res.json({
            message: "Welcome",
            user: req.user
        });

    }
);



// Global Error Middleware

app.use((err, req, res, next) => {

    console.error(err.message);

    res.status(
        err.statusCode || 500
    ).json({

        success: false,

        message:
            err.message ||
            "Internal Server Error"

    });

});


// =============================
app.listen(3000, () => {

    console.log(
        "Server running on port 3000"
    );

});