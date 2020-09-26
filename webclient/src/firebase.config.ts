import { initializeApp, auth, firestore } from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyDC8ajeqJR30bdcguHXOPxSRlJo2sfY3Mg",
  authDomain: "dilo-dev.firebaseapp.com",
  databaseURL: "https://dilo-dev.firebaseio.com",
  projectId: "dilo-dev",
  storageBucket: "dilo-dev.appspot.com",
  messagingSenderId: "741989785052",
  appId: "1:741989785052:web:a742ad08b1a54d29b18319"
};

 const FirebaseApp = initializeApp(firebaseConfig)

 const Auth = auth(FirebaseApp)

 const FireStore = firestore(FirebaseApp)

 const DB = {
  'user': FireStore.collection('user'),
  'publicRoom': FireStore.collection('publicRoom'),
  runTransaction: FireStore.runTransaction
 }

 console.log({ FirebaseApp, Auth })

 export { Auth, DB }