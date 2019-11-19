const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const {
    User,
    validate,
    validateLogin
} = require("../models/users.js");


app.use(express.json());


app.post('/register', (req, res) => {
    const validation = validate({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    if (!validation.error) {

        bcrypt.hash(req.body.password, 10)
            .then(async (hash) => {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                });
                const result = newUser.save()
                    .then(() => {
                        res.json({
                            "result": result
                        })
                    })
                    .catch((err) => res.json({
                        "error": err.errmsg
                    }));
            })
            .catch((err) => console.log("Error: ", err));
    } else {
        res.end(validation.error.message)
    }
});


app.post('/login', async (req, res) => {
    const userResponse = {
        email: req.body.email,
        password: req.body.password
    };
    const validation = validateLogin(userResponse);
    if (!validation.error) {
        const userCredentials = new User(userResponse);
        const loginResult = await User.find({
            email: userCredentials.email
        });
        if (loginResult.length === 0) {
            res.end("No user found");
        }
        bcrypt.compare(userCredentials.password, loginResult[0].password)
            .then((match) => {
                if (match) {
                    const token = userCredentials.generateJWT();
                    res.json({
                        "token": token,
                        "status": "Logging successfull"
                    });
                } else res.json({
                    "message": "Email and password does not match"
                });
            })
            .catch((err) => {
                res.send("Error", err);
            });
    } else res.end(validation.error.message);
});

app.post('/logout', (req, res) => {
    res.json({
        "Message": "Logged out"
    });
});


module.exports = app;