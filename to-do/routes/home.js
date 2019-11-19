const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("you are at home");
});
module.exports = router;