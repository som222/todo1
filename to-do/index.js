const express = require('express');
const mongoose = require('mongoose');
const app = express();
const home = require("./routes/home.js");
const user = require("./routes/user.js");
const task = require("./routes/todo.js");


//routes
app.use(express.json());
app.use('/home', home);
app.use('/user', user);
app.use('/task', task);


//connecting to db
mongoose.connect("mongodb://localhost/todo")
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.log("Error: ", err));


//listen to a port
const PORT = 3002;
app.listen(PORT, () => console.log("Listening to : ", PORT));