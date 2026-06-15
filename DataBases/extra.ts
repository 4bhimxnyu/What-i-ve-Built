import dotenv from "dotenv";
dotenv.config({ path : "../.env"});

import express, {Request, Response} from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
const Port = process.env.PORT || 3000 ;
const Secret = process.env.SECRET_KEY as string;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string).then( () => {console.log("Database connected")}).catch((err)=>{console.log("database could not connect")});


interface IUser{
    name:string;
    email:string;
    password:string;
}

const userSchema = new mongoose.Schema<IUser>({
    name:{
        type: String,
        required :true
    },
    email:{
        type: String,
        required : true,
        unique : true
    },
    password:{
        type: String,
        required : true
    }
})

const User = mongoose.model<IUser>("extra", userSchema);