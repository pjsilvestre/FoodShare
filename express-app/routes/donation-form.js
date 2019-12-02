const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config-admin');
const firebase = require('../config/firebase-config-client');

const database = admin.firestore();

/* GET donation-form page */
router.get('/', (req, res) => {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      res.redirect('/');
    } else {
      res.render('donation-form');
    }
  });
});

/* POST donation-form page, redirecting to donation-board */
router.post('/', (req, res) => {
  firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    } else {
      try {
        // get data from req, formatting if necessary
        let amount = req.body.amount;

        // DOM string -> JavaScript date object
        let expiration_date = req.body.expiration_date;
        expiration_date = new Date(expiration_date);

        // DOM string -> JavaScript date object
        let pickup_date = req.body.pickup_date;
        pickup_date = new Date(pickup_date);

        // date validation
        let currentDate = new Date(Date.now());
        if (expiration_date < currentDate) {
          throw new Error('Invalid expiration date.');
        } else if (pickup_date < currentDate) {
          throw new Error('Invalid pickup date.');
        } else if (expiration_date < pickup_date) {
          throw new Error('Expiry date must be after pickup date.');
        }

        let food_item = req.body.food_item;
        let meeting_point = req.body.meeting_point;

        let latitude = req.body.meeting_point_geopoint_latitude;
        let longitude = req.body.meeting_point_geopoint_longitude;
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        let meeting_point_geopoint;
        try {
          meeting_point_geopoint = new admin.firestore.GeoPoint(
            latitude,
            longitude
          );
        } catch (error) {
          throw new Error(
            'Please choose a meeting point from the dropdown menu.'
          );
        }

        let requested = false;
        let expired = false;
        let fulfilled_donator = false;
        let fulfilled_donatee = false;

        let halal = req.body.halal ? true : false;
        let kosher = req.body.kosher ? true : false;
        let pescatarian = req.body.pescatarian ? true : false;
        let vegan = req.body.vegan ? true : false;
        let vegetarian = req.body.vegetarian ? true : false;

        // create payload to send to Firestore
        let data = {
          amount: amount,
          date_added: new Date(Date.now()),
          donatee: null,
          donator: user.uid,
          expiration_date: expiration_date,
          pickup_date: pickup_date,
          food_item: food_item,
          meeting_point: meeting_point,
          meeting_point_geopoint: meeting_point_geopoint,
          requested: requested,
          expired: expired,
          fulfilled_donator: fulfilled_donator,
          fulfilled_donatee: fulfilled_donatee,

          halal: halal,
          kosher: kosher,
          pescatarian: pescatarian,
          vegan: vegan,
          vegetarian: vegetarian,
        };

        await database.collection('donations').add(data);
      } catch (error) {
        res.render('donation-form', { user: user, errorMessage: error });
      }

      res.redirect('donation-board');
    }
  });
});

module.exports = router;
