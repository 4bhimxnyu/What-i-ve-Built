const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing
app.use(express.json());

const PORT = 3000;

let users = [];

app.get("/", (req,res) =>{
    res.json({
        message: "Welcome to the login system"
    });
    console.log("this is the home page");
})

app.post("/register", (req, res) =>{

    const {username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    users.push({
        username,
        password : hashedPassword
    })

    
    console.log(users);
    res.json({
        message: "User has been registered successfully"
    })
}); 

app.get("/users", (req, res) =>{
    res.json(users);
});

app.get("/users/:username", (req,res) =>{
    const username = req.params.username;
    console.log(username);

    const user = users.find(
        u => u.username === username 
    );

    if(!user){
        return res.status(404).json({
            message: "User not found"
        });
    }
    console.log(`user has been found ${user.username}`);
    res.status(200).json({user})
})

app.listen(PORT, () =>{
    console.log(`Server is running on port https://localhost:3000`);
})