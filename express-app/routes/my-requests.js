const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config-admin');
const firebase = require('../config/firebase-config-client');

const database = admin.firestore();

/* get my-requests page */
router.get('/', (req, res) => {
  let donations = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    }
    await database
      .collection('donations')
      .where('donatee', '==', user.uid)
      .orderBy('expiration_date')
      .get()
      .then(snapshot => {
        donations = snapshot.docs.map(document => {
          let donation = document.data();
          donation.id = document.id;

          let dietary_restrictions = '';
          if (donation.halal) dietary_restrictions += 'Halal ';
          if (donation.kosher) dietary_restrictions += 'Kosher ';
          if (donation.pescatarian) dietary_restrictions += 'Pescatarian ';
          if (donation.vegan) dietary_restrictions += 'Vegan ';
          if (donation.vegetarian) dietary_restrictions += 'Vegetarian';

          donation.dietary_restrictions = dietary_restrictions;

          let date_added = donation.date_added;
          let pickup_date = donation.pickup_date;
          let expiration_date = donation.expiration_date;

          // Firestore timestamp -> JavaScript date object
          date_added = date_added.toDate();
          pickup_date = pickup_date.toDate();
          expiration_date = expiration_date.toDate();

          // JavaScript date objects -> DOM strings
          date_added = date_added.toLocaleString();
          pickup_date = pickup_date.toLocaleString();
          expiration_date = expiration_date.toLocaleString();

          donation.date_added = date_added;
          donation.pickup_date = pickup_date;
          donation.expiration_date = expiration_date;

          return donation;
        });
      });

    res.render('my-requests', { user: user, donations });
  });
});

module.exports = router;
