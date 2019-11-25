const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-config-admin");
const firebase = require("../config/firebase-config-client");

const database = admin.firestore();

/* GET donation-board page */
router.get("/", (req, res) => {
  let donations = firebase.auth().onAuthStateChanged(async user => {
    await database
      .collection("donations")
      .get()
      .then(snapshot => {
        donations = snapshot.docs.map(document => {
          let donation = document.data();
          donation.id = document.id;

          //convert timestamp to human-readable format for display only
          donation.expiration_date = donation.expiration_date.toDate();

          return donation;
        });
      });

    //console.log(donations);

    if (user) {
      res.render("donation-board", { user: user, donations });
    } else {
      res.render("donation-board", { donations });
    }
  });
});

module.exports = router;
