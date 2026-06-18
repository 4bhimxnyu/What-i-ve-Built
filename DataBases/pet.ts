import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const app = express();
const Port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("Database connected");
    })
    .catch(() => {
        console.log("Database could not connect");
    });


// initializing all the fields
interface IUser {
    name: string;
    id: string;
    age: number;
}

//decribing all the fields
const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    }
});

//schema to create pets

const Pet = mongoose.model<IUser>("pets", userSchema);

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "welcome to pet store."
    });
});

app.post(
    "/signup",
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = req.body;

            if (Array.isArray(data)) {
                const pets = data.map((pet) => ({
                    name: pet.name,
                    id: pet.id,
                    age: pet.age
                }));

                await Pet.insertMany(pets);

                res.status(201).json({
                    message: `${pets.length} pets registered successfully`
                });

                return;
            }

            const { name, id, age } = data;

            if (!(name && id && age)) {
                next(new Error("Some of your pet's data is missing"));
                return;
            }

            const existingPet = await Pet.findOne({
                id: id
            });

            if (existingPet) {
                next(new Error("Your pet already exists"));
                return;
            }

            const pet = new Pet({
                name,
                id: id,
                age
            });

            await pet.save();

            res.status(201).json({
                message: "Pet registered successfully"
            });

        } catch (error) {
            next(error);
        }
    }
);

app.post(
    "/signin",
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { name, id } = req.body;

            const pet = await Pet.findOne({
                id: id
            });

            if (!pet) {
                next(new Error(`your pet ${name} is not there`));
                return;
            }

            res.json({
                message: `login success.. you can take your pet ${name} homee.`
            });
        } catch (error) {
            next(error);
        }
    }
);

app.get("/pets", async (req : Request , res : Response, next : NextFunction)=>{
    try{
        const pets = await Pet.find();

        res.json(pets);
    }
    catch(error){
        next(error)
    }
});


//global middleware for errors

app.use(
    (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        res.status(500).json({
            success: false,
            message: err.message || "pet riot has started. wel'be back"
        });
    }
);

app.listen(Port, () => {
    console.log(`Server running on http://localhost:${Port}`);
});