const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-config-admin");

/* GET register page. */
router.get("/", (req, res) => {
  res.render("register");
});

/* POST register page. */
router.post("/", (req, res) => {
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
    .then(() => {
      // See the UserRecord reference doc for the contents of userRecord.
      res.render("login");
    })
    .catch(error => {
      res.render("register", { errorMessage: error });
    });
});

module.exports = router;
