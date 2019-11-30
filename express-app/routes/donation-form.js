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
      let amount = req.body.amount;
      let expiration_date = req.body.expiration_date;
      let food_item = req.body.food_item;
      let meeting_point = req.body.meeting_point;

      let latitude = req.body.meeting_point_geopoint_latitude;
      let longitude = req.body.meeting_point_geopoint_longitude;
      latitude = parseFloat(latitude);
      longitude = parseFloat(longitude);
      let meeting_point_geopoint = new admin.firestore.GeoPoint(
        latitude,
        longitude
      );

      let status = 'unrequested';

      let halal = req.body.halal ? true : false;
      let kosher = req.body.kosher ? true : false;
      let pescatarian = req.body.pescatarian ? true : false;
      let vegan = req.body.vegan ? true : false;
      let vegetarian = req.body.vegetarian ? true : false;

      let data = {
        amount: amount,
        date_added: Date.now(),
        donatee: null,
        donator: user.uid,
        expiration_date: expiration_date,
        food_item: food_item,
        meeting_point: meeting_point,
        meeting_point_geopoint: meeting_point_geopoint,
        status: status,

        halal: halal,
        kosher: kosher,
        pescatarian: pescatarian,
        vegan: vegan,
        vegetarian: vegetarian,
      };

      try {
        await database.collection('donations').add(data);
      } catch (error) {
        if (error) {
          console.err(error);
          res.redirect('donation-form');
        }
      }

      res.redirect('donation-board');
    }
  });
});

module.exports = router;
