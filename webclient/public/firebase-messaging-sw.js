// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCtboeQU-cw2i0bQhdCI6sAGR2V_J0WpQM",
  authDomain: "dilo-firebase.firebaseapp.com",
  databaseURL: "https://dilo-firebase.firebaseio.com",
  projectId: "dilo-firebase",
  storageBucket: "dilo-firebase.appspot.com",
  messagingSenderId: "853945860629",
  appId: "1:853945860629:web:0ff4f228854d57c890841c",
  measurementId: "G-G3GLCHQTTP"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
