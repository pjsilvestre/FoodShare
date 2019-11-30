const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-config-admin");
const firebase = require("../config/firebase-config-client");

const database = admin.firestore();

/* GET my-donations page */
router.get("/", (req, res) => {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            res.redirect("/");
        }
        else {
            res.render("my-donations");
        }
    })
})

module.exports = router;
