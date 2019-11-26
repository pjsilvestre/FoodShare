const express = require("express");
const router = express.Router();
const firebase = require("../config/firebase-config-client");

/* Get donation-form page */
router.get("/", (req, res) => {
    res.render("donation-form");
  });

  module.exports = router;