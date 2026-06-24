import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY as string;

const token = jwt.sign(
    {
        name: "abhimanyu"
    },
    secretKey
);

console.log(token);

const decoded = jwt.verify(token,secretKey)

console.log(decoded);