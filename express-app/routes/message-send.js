const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config-admin');
const firebase = require('../config/firebase-config-client');

const database = admin.firestore();

/* GET message-send page */
router.get('/', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    } else {
      res.render('message-send');
    }
  });

  unsubscribe();
});

/* POST donation-board page */

router.post('/', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    } else {
      try {
        //let sender = await user.id;
        let recipient = req.body.recipient;
        let the_message = req.body.message;
        let listing_name = req.body.listing_name;

        //let sent_date = message.sent_date;
        // Firestore timestamp -> JavaScript date object
        //sent_date = sent_date.toDate();

        // JavaScript date objects -> DOM strings
        //sent_date = sent_date.toLocaleString();

        //message.sent_date = sent_date;

        let data = {
          listing_name: listing_name,
          message: the_message,
          recipient: recipient,
          sender: user.uid,
          sent_date: new Date(Date.now()),
        };

        await database.collection('messages').add(data);
      } catch (error) {
        res.render('index', { user: user, errorMessage: error });
      }

      res.redirect('/message-inbox');
    }
  });

  unsubscribe();
});

module.exports = router;
