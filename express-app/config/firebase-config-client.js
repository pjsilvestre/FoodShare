const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyCEV6HqDHYuIM1eAGrUw3tGAfIV-l4d88Y",
  authDomain: "foodshare-d3eee.firebaseapp.com",
  databaseURL: "https://foodshare-d3eee.firebaseio.com",
  projectId: "foodshare-d3eee",
  storageBucket: "foodshare-d3eee.appspot.com",
  messagingSenderId: "265720897822",
  appId: "1:265720897822:web:92ec456677a9e3716a690f",
  measurementId: "G-KS792GTVDM"
};

firebase.initializeApp(firebaseConfig);

module.exports = firebase;
