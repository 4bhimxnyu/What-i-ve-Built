const express = require("express");

const app = express();


app.use(express.json());


app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === "admin" &&
        password === "123"
    ) {

        return res.json({  
            message: "Login successful"
        })
        ;

    }

    return res.status(401).json({
        message: "Invalid credentials"
    });

});


let users = [];

app.post("/register",(req,res) =>{
    const { username, password } = req.body;
    users.push({
        username,
        password
    });

    res.json({
        message: "User registered successfully"
    });
})

//checking all the users using get request
app.get("/dataprofile",(req,res) =>{
    res.json(users);
});

app.post("/sum",(req,res) =>{
    const { num1, num2 } = req.body;
    console.log(num1,num2);
    const sum = num1 + num2;
    console.log(sum);
    res.json({
        sum
    });
})


app.get("/hello",(req,res) =>{
    res.json({
        message: "Hello World"
    })
})

app.listen(3000);

