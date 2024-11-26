// config/firebaseConfig.js

import { config } from 'dotenv';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

config();

let firebaseApp;
let firestoreDb;
let firebaseMessaging;

const initializeFirebase = () => {
  if (!firebaseApp) {
    try {
      const serviceAccount = JSON.parse(
        readFileSync(path.resolve('./config/serviceAccountKey.json'), 'utf-8')
      );

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
      });

      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error.message);
      throw new Error('Firebase initialization failed');
    }
  } else {
    console.log('Firebase Admin SDK already initialized');
  }

  if (!firestoreDb) {
    firestoreDb = admin.firestore();
  }

  if (!firebaseMessaging) {
    firebaseMessaging = admin.messaging();
  }

  return { firebaseApp, firestoreDb, firebaseMessaging };
};

const { firestoreDb: db, firebaseMessaging: messaging } = initializeFirebase();

export { admin, db, messaging };

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
