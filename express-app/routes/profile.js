const express = require('express');
const router = express.Router();
const firebase = require('../config/firebase-config-client');

/* Get profile page */
router.get('/', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(user => {
    if (user) {
      res.render('profile', { user: user });
    } else {
      res.redirect('/');
    }
  });

  unsubscribe();
});

module.exports = router;
