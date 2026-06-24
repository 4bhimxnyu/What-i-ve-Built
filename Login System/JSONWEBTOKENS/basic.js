const jwt = require('jsonwebtoken')

const SECRET_KEY = "124#4lexii22";

console.log(SECRET_KEY);

const token = jwt.sign(
    {
        name : "abhimanyu"
    },SECRET_KEY
);

console.log(token);


const decoded = jwt.verify(token,SECRET_KEY);

console.log(decoded);