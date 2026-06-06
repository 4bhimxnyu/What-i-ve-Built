const express = require('express');
const app = express();
app.use(express.json());
const fs = require('fs');

const PORT = 3000;

app.get("/", (req,res) =>{
    //res.send("Welcome to the login system");
    res.json({
        message: "Welcome to the login system"
    });
    console.log("this is the home page");
})

const logger = (req, res, next) =>{
    fs.writeFileSync("log.txt", `Method: ${req.method}, URL: ${req.url}, Time: ${new Date().toISOString()}\n`, {flag: "a"});
    console.log(`logging the time right now in seconds ${Date.now()}`);
    next();
}

function checkingUser(req, res, next) {
    const {username, password} = req.body;
    if(!username || !password){
        console.log("username or password is missing");
        return res.status(400).json({
            message: "Username and password are required"
        });
        if(username === "abhimanyu" && password === "password123"){
        res.status(200).json({
            message: "user is the admin"
        });
    }
    }
    
    next();
};

app.post("/login", checkingUser, (req, res) =>{
    res.status(200)
    .json({
        message: "Login successful"
    });
});

app.listen(PORT, () =>{
    console.log(`Server is running on port https://localhost:${PORT}`);
});

