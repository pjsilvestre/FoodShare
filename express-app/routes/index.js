const express = require('express');
const router = express.Router();
const firebase = require('../config/firebase-config-client');

/* GET home page. */
router.get('/', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(user => {
    res.render('index', { user: user });
  });

  unsubscribe();
});

/* DELETE home page (logout).*/
router.post('/logout', (req, res) => {
  firebase
    .auth()
    .signOut()
    .catch(error => {
      res.render('index', { errorMessage: error });
    });

  res.redirect('/');
});

module.exports = router;
