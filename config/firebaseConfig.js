// config/firebaseConfig.js

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });

  console.log("Firebase Admin SDK initialized successfully");
} else {
  console.log("Firebase Admin SDK already initialized");
}

const db = admin.firestore();

const messaging = admin.messaging();

module.exports = { admin, db, messaging };
