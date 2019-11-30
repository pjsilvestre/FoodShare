const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config-admin');
const firebase = require('../config/firebase-config-client');

const database = admin.firestore();

/* GET my-donations page */
router.get('/', (req, res) => {
  let donations = firebase.auth().onAuthStateChanged(async user => {
    await database
      .collection('donations')
      .where('donator', '==', user.uid)
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

          return donation;
        });
      });
    if (user) {
      res.render('my-donations', { user: user, donations });
    } else {
      res.redirect('/');
    }
  });
});

/* POST my-donations page, redirecting to my-donations*/
router.post('/', (req, res) => {
  firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    } else {
      try {
        let id = req.body.id;
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
