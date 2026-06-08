require("dotenv").config();
const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT;


app.use(express.json());


const SECRET_KEY = process.env.SECRET_KEY;
let users = [];

app.get("/", (req,res) =>{
    res.json({
        message: "Welcome to the login system"
    });
    console.log("this is the home page");
});

app.post("/register", async (req, res) =>{
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user) {
        return res.status(401).json({
            message: "user already exists"
        });
    }

    const newPassword = await bcrypt.hash(password, 10);
    const newUser = {
        username,
        password: newPassword
    }
    users.push(newUser);
    res.status(200).json({
        message: "User has been registered successfully"
    })
});


app.post("/login",async (req, res)=>{
    const { username, password } = req.body;
    const user = users.find(
        u => u.username === username
    )
    if (!user) {
        return res.status(401).json({
            message: "user not found"
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
    const token = jwt.sign(
    {
        username : user.username
    }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({
        message: "Login successful",
        token
    });
})


function auth(req, res, next){
    const token = req.headers.authorization;
    if (!token){
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try{
        const decoded = jwt.verify(token,SECRET_KEY);
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

app.get("/profile", auth, (req, res) => {

    res.status(200).json({
        message: "Welcome to your profile",
        user: req.user
    });

});


// ======================
// SETTINGS ROUTE
// ======================
app.get("/settings", auth, (req, res) => {

    res.status(200).json({
        message: "Settings page",
        user: req.user
    });

});


// ======================
// DASHBOARD ROUTE
// ======================
app.get("/dashboard", auth, (req, res) => {

    res.status(200).json({
        message: "Dashboard page",
        user: req.user
    });

});


// ======================
// GET ALL USERS
// ======================
app.get("/users", (req, res) => {

    res.status(200).json(users);

});


// Start server
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});