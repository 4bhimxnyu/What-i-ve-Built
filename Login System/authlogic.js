const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

app.use(express.json());

let users = [];

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Login System"
    });
});

// Middleware Example
const auth = (req, res, next) => {
    console.log("Authentication middleware executed");
    next();
};

// Register User
app.post("/register", auth, (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const existingUser = users.find(
        user => user.username === username
    );

    if (existingUser) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    users.push({
        username,
        password: hashedPassword
    });

    console.log(users);

    res.status(201).json({
        message: "User registered successfully"
    });
});

// Login User
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const user = users.find(
        user => user.username === username
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const isMatch = bcrypt.compareSync(
        password,
        user.password
    );

    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    res.status(200).json({
        message: "Login successful"
    });
});

// Get All Users
app.get("/users", (req, res) => {

    const safeUsers = users.map(user => ({
        username: user.username
    }));

    res.json(safeUsers);
});

// Get User By Username
app.get("/users/:username", (req, res) => {

    const username = req.params.username;

    const user = users.find(
        user => user.username === username
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json({
        username: user.username
    });
});

// Delete User
app.delete("/users/delete/:username", (req, res) => {

    const username = req.params.username;

    const userIndex = users.findIndex(
        user => user.username === username
    );

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    users.splice(userIndex, 1);

    res.status(200).json({
        message: `${username} deleted successfully`
    });
});

// Update Password
app.put("/users/update/:username", (req, res) => {

    const username = req.params.username;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            message: "Password is required"
        });
    }

    const user = users.find(
        user => user.username === username
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.password = bcrypt.hashSync(password, 10);

    res.status(200).json({
        message: "Password updated successfully"
    });
});

// Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});