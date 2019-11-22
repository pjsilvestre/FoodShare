const admin = require("firebase-admin");
const serviceAccount = require("../secrets/foodshare-d3eee-firebase-adminsdk-muxzq-c6401baa87.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodshare-d3eee.firebaseio.com"
});

module.exports = admin;
