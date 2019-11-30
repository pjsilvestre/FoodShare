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

          //convert timestamps to human-readable format for display only
          donation.expiration_date = donation.expiration_date.toDate();
          donation.date_added = donation.date_added.toDate();

          let dietary_restrictions = "";
          if (donation.halal) dietary_restrictions += "Halal ";
          if (donation.kosher) dietary_restrictions += "Kosher ";
          if (donation.pescatarian) dietary_restrictions += "Pescatarian ";
          if (donation.vegan) dietary_restrictions += "Vegan ";
          if (donation.vegetarian) dietary_restrictions += "Vegetarian";

          donation.dietary_restrictions = dietary_restrictions

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
