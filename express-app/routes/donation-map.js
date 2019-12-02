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
      initMap();
    } else {
      res.redirect("/");
    }
  });
});

function initMap() {
  // The location of Uluru
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
}

  module.exports = router;