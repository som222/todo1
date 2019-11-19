const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require("config");

//schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 64,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 110,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000,
    }
});

userSchema.methods.generateJWT = function () {
    return jwt.sign({
        _id: this._id
    }, config.get("jwtPrivateKey"));
};

//validate
function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(64).required(),
        email: Joi.string().min(5).max(110).required().email(),
        password: Joi.string().min(5).max(1000).required()
    };
    return Joi.validate(user, schema);
}

function validateLogin(user) {
    const schema = {
        email: Joi.string().min(5).max(110).required().email(),
        password: Joi.string().min(5).max(1000).required()
    };
    return Joi.validate(user, schema);
}
//init in the db
const User = mongoose.model('users', userSchema);

//exports

exports.validate = validateUser;
exports.validateLogin = validateLogin;
exports.User = User;