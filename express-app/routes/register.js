const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-config");

/* GET login page. */
router.get("/", function(req, res, next) {
  res.render("register");
});

module.exports = router;
