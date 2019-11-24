const express = require("express");
const router = express.Router();
const firebase = require("../config/firebase-config-client");

/* GET login page */
router.get("/", (req, res) => {
  res.render("login");
});

/* POST login page */
router.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error.message);
      res.redirect("/");
    });
});

module.exports = router;
