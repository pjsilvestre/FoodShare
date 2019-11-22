const express = require("express");
const router = express.Router();
const firebase = require("../config/firebase-config-client");

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
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode) {
        res.render("login", { errorMessage: errorMessage });
      }
    });

  res.redirect("/");
});

module.exports = router;
