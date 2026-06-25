import dotenv from "dotenv";
dotenv.config(
    {path: "../.env"}
);

import express, { Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT;
const Secretkey = process.env.SECRET_KEY as string;

app.use(express.json()); //creating middleware


// connecting mongodb
mongoose.connect(process.env.MONGO_URI as string).then( ()=>{
    console.log("database is connected");
}).catch((err)=>{
    console.log(err);
})

// creates an interface or map of how info will be stored
interface IUser{
    name : string,
    email: string,
    password : string
}

interface ITodo{
    task: string,
    progress : boolean,
    userId : string
}


// describing scheme/ type of data and requirements
const userSchema = new mongoose.Schema<IUser>({
    name: {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password: {
        tpye : String,
        required : true
    }
});

const todoSchema = new mongoose.Schema<ITodo>({
    task:{
        type : String,
        required : true
    },
    progress:{
        type: Boolean,
        default: false
    },
    userId:{
        type: String,
        required : true
    }
})


const User = mongoose.model<IUser>(
    "Users",
    userSchema
)

const Todo = mongoose.model<ITodo>(
    "Todos",
    todoSchema
)

interface AuthRequest extends Request{
    users?: any;
}

const auth = (
    req : AuthRequest,
    res : Response,
    next: NextFunction
) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Token missing"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            Secretkey
        );

        req.user = decoded;

        next();
    }
    catch{
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

app.get("/", (req: Request, res: Response) => {
    res.json({
        message : "welcome to the home page."
    })
})

app.post("/signup", async(
    req : Request,
    res : Response
)=>{
    try{
        const{ name , email, password }= req.body;
        const  existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "user already exist"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            name,
            email,
            password : hashedPassword
        });
        await user.save();
        
        res.status(201).json({
            message: "user created"
        })
    }
    catch{
        res.status(500).json({
            message : "invalid credentials"
        })
    }
    
});


app.post("/signin", async( req : Request , res : Response)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            Secretkey
        );
    }
    catch{
        res.status(500).json({
            message : "internal server error"
        })
    }
})

app.post("/todos", async(
    req : Request,
    res : Response
)=>{
    try{
        const title = req.body;
        const todo = new Todo({
            title,
            userId : req.user.id
        })
        await todo.save();
        
        res.status(201).json({
            message : "Todo list created"
        })


    }
    catch{
        res.status(500).json({
            message: "Internal Server error"
        })
    }
})

