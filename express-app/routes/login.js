const express = require("express");
const router = express.Router();
const firebase = require('../config/firebase-config-client');

/* GET login page */
router.get("/", function(req, res, next) {
  res.render("login");
});

/* POST login page */
router.post("/", function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === "auth/wrong-password") {
        alert("Wrong password.");
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });

  res.redirect("/");
});

module.exports = router;
