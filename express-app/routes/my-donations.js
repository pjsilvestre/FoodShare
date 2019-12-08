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
          let pickup_date = donation.pickup_date.toDate();

          if (expiration_date < currentDate || pickup_date < currentDate) {
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
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    }
    let donations;

    await database
      .collection('donations')
      .where('donator', '==', user.uid)
      .orderBy('request_accepted', 'desc') // show accepted requests
      .orderBy('requested', 'desc') // show pending requests
      .orderBy('expiration_date')
      .get()
      .then(snapshot => {
        donations = snapshot.docs.map(document => {
          let donation = document.data();
          donation.id = document.id;

          // Firestore timestamp -> JavaScript date object -> DOM strings
          donation.date_added = donation.date_added.toDate().toLocaleString();
          donation.pickup_date = donation.pickup_date.toDate().toLocaleString();
          donation.expiration_date = donation.expiration_date
            .toDate()
            .toLocaleString();

          let dietary_restrictions = '';
          if (donation.halal) dietary_restrictions += 'Halal ';
          if (donation.kosher) dietary_restrictions += 'Kosher ';
          if (donation.pescatarian) dietary_restrictions += 'Pescatarian ';
          if (donation.vegan) dietary_restrictions += 'Vegan ';
          if (donation.vegetarian) dietary_restrictions += 'Vegetarian';

          donation.dietary_restrictions = dietary_restrictions;

          return donation;
        });
      });

    res.render('my-donations', { user: user, donations });
    unsubscribe();
  });
});

/* POST my-donations page, accepting a request, redirecting to my-donations */
router.post('/accept', (req, res) => {
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
            request_accepted: true,
          });
      } catch (error) {
        res.render('index', { user: user, errorMessage: error });
      }

      res.redirect('/my-donations');
    }
  });

  unsubscribe();
});

/* POST my-donations page, fulfilling a request, redirecting to my-donations */
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
            fulfilled_donator: true,
          });
      } catch (error) {
        res.render('index', { user: user, errorMessage: error });
      }

      res.redirect('/my-donations');
    }
  });

  unsubscribe();
});

/* POST my-donations page, hiding a donation, redirecting to my-donations */
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
            hidden_donator: true,
          });
      } catch (error) {
        res.render('index', { user: user, errorMessage: error });
      }

      res.redirect('/my-donations');
    }
  });

  unsubscribe();
});

/* POST my-donations page, deleting a donation, redirecting to my-donations */
router.post('/delete', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
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

  unsubscribe();
});

module.exports = router;
