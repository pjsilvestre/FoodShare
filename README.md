# foodshare

This repo contains the project developed by [Jesus Fuentes Nava](https://github.com/jefuentesnava), [Ryan Hong](https://github.com/ryanhhong), [Patrick Silvestre](https://github.com/pjsilvestre), and [Jeffrey Wu](https://github.com/JesWu) for CMPE 133 at San Jose State University during the Fall 2019 semester.

## Setting the Service Account
Using the Firebase Admin SDK requires a private key file. In the context of this app, the JSON file containing the key should be stored in `FoodShare/express-app/secrets`. Contact an admin for this private key file if necessary.

## Running in Development Mode
Make sure you have [Node.js](nodejs.org) installed.
```sh
git clone git@github.com:pjsilvestre/FoodShare.git
cd FoodShare/express-app
npm install
npm run devstart
```
The app should now be running on [localhost:3000](localhost:3000).