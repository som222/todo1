const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();
const {
    ToDo,
    validateTODO
} = require('../models/todo');


router.use(express.json());


router.get('/add/:task', auth, (req, res) => {
    const newTask = new ToDo({
        task: req.params.task
    });
    const result = validateTODO(newTask.toJSON());

    if (result.error) {
        res.end(result.error)
    } else {
        newTask.save()
            .then(() => res.send("Saved in DB"))
            .catch((err) => res.send("Error: ", err));
    }
    res.json({
        "msg": "Task entered successfully",
    });
});

router.get('/display', auth, async (req, res) => {
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 5;
    const tasks = await ToDo
        .find()
        .select({
            taks: 1,
            done: 1,
            date: 1
        })
        .sort({
            date: 1
        })
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize);
    res.send(tasks);
})

router.get('/display/:date', auth, async (req, res) => {
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 5;
    const tasks = await ToDo
        .find({
            date: req.params.date
        })
        .select({
            taks: 1,
            done: 1,
            date: 1
        })
        .sort({
            date: 1
        })
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize);
    res.send(tasks);
})

router.post('/update', auth, async (req, res) => {
    const updateValues = {
        task: req.body.task,
        date: Date.now(),
        done: req.body.done
    };
    const validationStatus = validateTODO(updateValues);
    // res.send(validationStatus)
    if (validationStatus.error) res.end("Error while UPDATING");
    else {
        try {
            const result = await ToDo.update({
                _id: req.body.id
            }, {
                $set: updateValues
            });
            res.send(result);
        } catch (ex) {
            res.end("Exception: ", ex);
        }
    }
});

router.delete('/delete', auth, (req, res) => {
    const result = ToDo.deleteOne({
            _id: req.body.id
        })
        .then(() => res.end("Object deleted"))
        .catch((err) => res.send("Error:", err));
});


module.exports = router;