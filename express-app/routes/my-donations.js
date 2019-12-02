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

/* GET my-donations page */
router.get('/', (req, res) => {
  let donations = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    }

    await database
      .collection('donations')
      .where('donator', '==', user.uid)
      .where('expired', '==', false)
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

    res.render('my-donations', { user: user, donations });
  });
});

/* POST my-donations page, redirecting to my-donations*/

router.post('/', (req, res) => {
  firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    } else {
      try {
        let id = req.body.donation_id;
        await database
          .collection('donations')
          .doc(id)
          .delete();
        res.redirect('back');
      } catch (error) {
        if (error) {
          console.err(error);
          res.redirect('back');
        }
      }
    }
  });
});

module.exports = router;
