const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config-admin');
const firebase = require('../config/firebase-config-client');

const database = admin.firestore();

/* Get maps page */
router.get("/", (req, res) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      res.render("donation-map", { user: user });
    } else {
      res.redirect("/");
    }
  });
});

  module.exports = router;