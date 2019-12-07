const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config-admin');
const firebase = require('../config/firebase-config-client');

const database = admin.firestore();

/* GET message-inbox page */
router.get('/', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    let messages;
    await database
      .collection('messages')
      .orderBy('sent_date', 'desc')
      .get()
      .then(snapshot => {
        messages = snapshot.docs.map(document => {
          let message = document.data();
          message.id = document.id;

          let sent_date = message.sent_date;

          let recipient = message.recipient;
          let sender = message.sender;
          let the_message = message.the_message;
          let listing_name = message.listing_name;

          // Firestore timestamp -> JavaScript date object
          sent_date = sent_date.toDate();

          // JavaScript date objects -> DOM strings
          sent_date = sent_date.toLocaleString();

          message.sent_date = sent_date;

          return message;
        });
      });

    if (user) {
      res.render('message-inbox', { user: user, messages });
    } else {
      res.render('message-inbox', { messages });
    }
  });

  unsubscribe();
});

/* POST message-inbox page */
/*
the plan is to reroute to message-send then that page will pick up any database items where sender == your uid and sent_date is null
maybe have a special page just to reply??
*/

router.post('/', (req, res) => {
  let unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      res.redirect('/');
    } else {
      try {
        let message_id = req.body.message_id;
        let sender = await user.uid;
        let listing_name = message.listing_name;
        let data = {
          listing_name,
        };
        await database
          .collection('messages')
          .doc(message_id)
          .update({
            donatee: donatee,
            requested: true,
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
