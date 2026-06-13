import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY as string;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });

interface IUser {
    name: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model<IUser>("Users", userSchema);

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Welcome to the homepage"
    });
});

app.post("/signup", async (req: Request, res: Response) => {
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email: username,
            password: hashedPassword
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

app.post("/signin", async (req: Request, res: Response) => {
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

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.email
            },
            SECRET_KEY
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, "-password");

        res.json({
            users
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