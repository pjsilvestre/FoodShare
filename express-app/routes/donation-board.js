const express = require("express");
const router = express.Router();
const firebase = require("../config/firebase-config-client");

/* GET donation-board page */
router.get("/", (req, res) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      res.render("donation-board", { user: user });
    } else {
      res.render("donation-board");
    }
  });
});

module.exports = router;
