const express = require("express");
const router = express.Router();
const firebase = require("../config/firebase-config-client");

/* GET home page. */
router.get("/", async function(req, res, next) {
  try {
    let user = await firebase.auth().currentUser;

    if (user) {
      res.render("index", { user: user });
    } else {
      res.render("index");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/index");
  }
});

/* DELETE home page (logout).*/
router.delete("/logout", (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });
  res.redirect("/");
});

module.exports = router;
