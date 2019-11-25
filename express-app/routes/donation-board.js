const express = require("express");
const router = express.Router();
const firebase = require("../config/firebase-config-client");

/* GET donation-board page */
router.get("/", (req, res) => {
    res.render("donation-board");
})

module.exports = router;