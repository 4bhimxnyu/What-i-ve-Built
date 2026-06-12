require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const Secret_key = process.env.SECRET_KEY;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

 const User = mongoose.model('Users', { name : String, email : String ,password: String });

// const auth = (req,res,next) => {
//     const {username , password } = req.body;
//     const name = req.body.name ;
    

//     const ExistingUser = username.f
//     if(!(username || password)){
//         return res.status(400).json({
//             message: "username or password missing."
//         })
//     }
// }


app.get("/", (req,res) =>{
    res.json({
        message : "Welcome to the homepage"
    })
})

app.post("/signup", async (req,res) =>{
    const {username , password} = req.body;
    const name = req.body.name;
 
    const ExistingUser = await User.findOne({ email : username});
    if(ExistingUser){
        res.status(400).json({
            message : "user already exists"
        })
    }

    const newPassword = await bcrypt.hash(password, 10);

    const User = new User({
        name: name,
        email: username,
        password : newPassword
    })


    user.save();
    res.json({
        message : "user registered successfully"
    })
})

app.listen(PORT ,() => {
    console.log(`your code is running on https://localhost${PORT}`)}
)