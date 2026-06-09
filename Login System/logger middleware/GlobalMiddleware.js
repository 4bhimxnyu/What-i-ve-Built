const express = require('express');

const bcrypt = require('bcrypt');
const {z} = require('zod');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
const secretKey = process.env.SECRET_KEY;
let users = [];
const port = process.env.PORT || 3000;


app.get("/", (req,res) =>{
    res.send("this is the home page");
});

//zod schema creation for validating the request body

function validateRequestBody(obj){
    const schema = z.object({
        username: z.string().min(1),
        password: z.coerce.string().min(8)
    })
    const result = schema.safeParse(obj);
    console.log(result);
}


app.post("/login", async (req, res) =>{
    const user = req.body;
    const result = validateRequestBody(user);
    if(!result.success){
        return res.status(400).json({
            message: "invalid request body",
            errors: result.error.errors
        });
    }
    else{
        res.send({
            message: `Welcome ${user.username} to our server, login successful.` 
        })
    }
});

app.listen(port, ()=>{
    console.log(`your server is online on https://localhost:${port}`)
});