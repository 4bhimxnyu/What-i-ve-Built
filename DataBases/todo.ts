// todo list app that takes multiple users and allow them to create their to do list. it uses crud operations using MongoDB,
// users can put their tasks on https://localhost/api/todos
// different task can be viewed using https://localhost/api/todos:id where id denotes the TodoId (taken from user id in post request try{} block)


import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();

const PORT = process.env.PORT || 3000;
const Secretkey = "ada12345"//process.env.SECRET_KEY as string;

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log(err);
    });

interface IUser {
    name: string;
    email: string;
    password: string;
}

interface ITodo {
    task: string;
    progress: boolean;
    userId: string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
});

const todoSchema = new mongoose.Schema<ITodo>({
    task: {
        type: String,
        required: true,
    },

    progress: {
        type: Boolean,
        default: false,
    },

    userId: {
        type: String,
        required: true,
    },
});

const User = mongoose.model<IUser>("Users", userSchema);

const Todo = mongoose.model<ITodo>("Todos", todoSchema);

interface AuthRequest extends Request {
    user?: JwtPayload;
}

const auth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Token Missing",
        });
    }

    try {
        const decoded = jwt.verify(token, Secretkey) as JwtPayload;

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token",
        });
    }
};

app.get("/api", (req: Request, res: Response) => {
    res.json({
        message: "Welcome to the Home Page",
    });
});

app.post("/api/signup", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!(name && email && password)) {
            return res.status(400).json({
                message: "Please provide all fields",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({
            message: "User Created Successfully",
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

app.post("/api/signin", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect Password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            Secretkey
        );

        res.json({
            message: "Login Successful",
            token,
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

app.post(
    "/api/todos",
    auth,
    async (req: AuthRequest, res: Response) => {
        try {
            const { task } = req.body;

            if (!task) {
                return res.status(400).json({
                    message: "Task is required",
                });
            }

            const todo = new Todo({
                task,
                userId: req.user?.id,
            });

            await todo.save();

            res.status(201).json({
                message: "Todo Created Successfully",
            });
        } catch (err) {
            console.log(err);

            res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
);

app.get(
    "/api/todos",
    auth,
    async (req: AuthRequest, res: Response) => {
        try {
            const todos = await Todo.find({
                userId: req.user?.id,
            });

            res.json({
                todos,
            });
        } catch (err) {
            console.log(err);

            res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
);

app.put(
    "/api/todos/:id",
    auth,
    async (req: AuthRequest, res: Response) => {
        try {
            const todoId = req.params.id;

            const todo = await Todo.findOneAndUpdate(
                {
                    _id: todoId,
                    userId: req.user?.id,
                },
                {
                    progress: true,
                },
                {
                    new: true,
                }
            );

            if (!todo) {
                return res.status(404).json({
                    message: "Todo not found",
                });
            }

            res.json({
                message: "Task Completed",
                todo,
            });
        } catch (err) {
            console.log(err);

            res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
);

app.delete(
    "/api/todos/:id",
    auth,
    async (req: AuthRequest, res: Response) => {
        try {
            const todoId = req.params.id;

            const todo = await Todo.findOneAndDelete({
                _id: todoId,
                userId: req.user?.id,
            });

            if (!todo) {
                return res.status(404).json({
                    message: "Todo not found",
                });
            }

            res.json({
                message: "Todo Deleted Successfully",
            });
        } catch (err) {
            console.log(err);

            res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});