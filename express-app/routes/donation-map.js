const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config-admin');
const firebase = require('../config/firebase-config-client');

const database = admin.firestore();

/* Get maps page */
router.get('/', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    await res.render('donation-map', { user: user });
  });

  unsubscribe();
});

module.exports = router;
