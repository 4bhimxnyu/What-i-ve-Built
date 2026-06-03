const express = require("express");

const app = express();


app.use(express.json());
const port = 3000;

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === "admin" &&
        password === "123"
    ) {

        return res.json({
            message: "Login successful"
        });

    }

    return res.status(401).json({
        message: "Invalid credentials"
    });

});

app.listen(3000);

