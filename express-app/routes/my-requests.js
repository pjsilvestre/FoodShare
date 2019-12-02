const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config-admin');
const firebase = require('../config/firebase-config-client');

const database = admin.firestore();

/* Check if donations are expired */
router.use(async (req, res, next) => {
  try {
    await database
      .collection('donations')
      .where('expired', '==', false)
      .get()
      .then(snapshot => {
        snapshot.docs.map(document => {
          let donation = document.data();
          let donation_id = document.id;

          let currentDate = new Date(Date.now());
          let expiration_date = donation.expiration_date.toDate();

          if (expiration_date < currentDate) {
            database
              .collection('donations')
              .doc(donation_id)
              .update({ expired: true });
          }
        });
      });
  } catch (error) {
    console.log(error);
  }

  console.log('Expired donation check complete.');
  next();
});

/* GET my-requests page */
router.get('/', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    }
    let donations;
    await database
      .collection('donations')
      .where('donatee', '==', user.uid)
      .orderBy('request_accepted', 'desc') // if a donation request has been accepted, show it first...
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

  unsubscribe();
});

/* POST my-requests page, fulfilling a request, redirecting to my-requests */
router.post('/fulfill', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    } else {
      try {
        let donation_id = req.body.donation_id;
        await database
          .collection('donations')
          .doc(donation_id)
          .update({
            fulfilled_donatee: true,
          });
      } catch (error) {
        res.render('index', { user: user, errorMessage: error });
      }

      res.redirect('/my-requests');
    }
  });

  unsubscribe();
});

/* POST my-requests page, hiding a request, redirecting to my-requests */
router.post('/hide', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    } else {
      try {
        let donation_id = req.body.donation_id;
        await database
          .collection('donations')
          .doc(donation_id)
          .update({
            hidden_donatee: true,
          });
      } catch (error) {
        res.render('index', { user: user, errorMessage: error });
      }

      res.redirect('/my-requests');
    }
  });

  unsubscribe();
});

/* POST my-requests page, cancelling a request, redirecting to my-requests */
router.post('/cancel', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    } else {
      try {
        let donation_id = req.body.donation_id;

        await database
          .collection('donations')
          .doc(donation_id)
          .update({
            donatee: null,
            requested: false,
            request_accepted: false,
          });
      } catch (error) {
        res.render('index', { user: user, errorMessage: error });
      }

      res.redirect('/my-requests');
    }
  });

  unsubscribe();
});
module.exports = router;
