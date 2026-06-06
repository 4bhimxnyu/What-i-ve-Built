const express = require('express');
const app = express();
app.use(express.json());

app.get("/", (req,res) =>{
    res.json({
        message: "Welcome to the login system"
    });
    console.log("this is the home page");
});

let count = 0;

function requestCounter(req, res, next){
    count ++;
    console.log(`Request count: ${count}`);
    next();
}

app.post("/login", requestCounter, (req, res) =>{
    const {username, password} = req.body;
    res.json({
        message: "Login successful"
    });
});  

app.listen(3000, () =>{
    console.log("Server is running on port https://localhost:3000");
} );