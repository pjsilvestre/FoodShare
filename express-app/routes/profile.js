const express = require("express");
const router = express.Router();
const firebase = require("../config/firebase-config-client");

/* Get profile page */
router.get("/", (req, res) => {
    res.render("profile");
  });

  module.exports = router;