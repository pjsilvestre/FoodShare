const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-config-admin");

/* GET register page. */
router.get("/", function(req, res, next) {
  res.render("register");
});

/* POST register page. */
router.post("/", function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  admin
    .auth()
    .createUser({
      uid: username,
      email: email,
      emailVerified: false,
      password: password,
      disabled: false
    })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
      res.render("login");
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
      res.render("register", {errorMessage: error});
    });
});

module.exports = router;
