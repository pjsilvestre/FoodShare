const express = require('express');
const router = express.Router();
const firebase = require('../config/firebase-config-client');

/* GET home page. */
router.get('/', (req, res) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      res.render('index', { user: user });
    } else {
      res.render('index');
    }
  });
});

/* DELETE home page (logout).*/
router.delete('/logout', (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(res.redirect('/'))
    .catch(error => {
      console.log(error);
      res.redirect('/');
    });
});

module.exports = router;
