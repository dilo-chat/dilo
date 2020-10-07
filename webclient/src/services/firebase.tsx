import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCtboeQU-cw2i0bQhdCI6sAGR2V_J0WpQM",
  authDomain: "dilo-firebase.firebaseapp.com",
  databaseURL: "https://dilo-firebase.firebaseio.com",
  projectId: "dilo-firebase",
  storageBucket: "dilo-firebase.appspot.com",
  messagingSenderId: "853945860629",
  appId: "1:853945860629:web:0ff4f228854d57c890841c",
  measurementId: "G-G3GLCHQTTP"
};

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth
export const store = firebase.firestore()
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export const messaging = firebase.messaging()
messaging.usePublicVapidKey('BDubAxr4_rp2WvPQdJjfejez_krZgGJmcmoWW9Jo96BTD-VovNHv1eEOwKwB8JefX_Vjnt4oBxshe6G7R6F0_iY')
