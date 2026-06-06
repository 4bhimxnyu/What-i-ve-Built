const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;


app.get("/", (req,res) =>{
    res.json({
        message: "Welcome to the login system"
    });
    console.log("this is the home page");
})  

app.post("/register", Checkup, (req, res)=>{

    res.status(200).json({
        message: "User has been registered successfully"
    });

});

function Checkup(req, res, next){
    const {username, password} = req.body;
    const Len = password.length;
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }
    if(Len < 8){
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
    }
    
    next()
}

app.listen(PORT, () =>{
    console.log(`Server is running on port https://localhost:${PORT}`);
});
