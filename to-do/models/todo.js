const mongoose = require('mongoose');
const JOi = require("joi");

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        minlength: 5
    },
    date: {
        type: Date,
        default: Date.now()
    },
    done: {
        type: Boolean,
        default: false,
    }

});

function validateTODO(user) {
    const schema = {
        task: JOi.string().required().min(5),
        date: JOi.date().required().default(Date.now()),
        done: JOi.boolean().default(false),
        _id: JOi.any()
    }
    return JOi.validate(user, schema);
}

//init
const TODO = mongoose.model('todo', todoSchema);

exports.ToDo = TODO;
exports.validateTODO = validateTODO;