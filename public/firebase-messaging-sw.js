importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js'
);

self.addEventListener('fetch', () => {
  try {
    const urlParams = new URLSearchParams(location.search);
    self.firebaseConfig = Object.fromEntries(urlParams);
  } catch (err) {
    console.error('Failed to add event listener', err);
  }
});
// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true
};
// Initialize Firebase app
firebase.initializeApp(self.firebaseConfig || defaultConfig);

let messaging;
try {
  messaging = firebase.messaging();
} catch (err) {
  console.error('Failed to initialize Firebase Messaging', err);
}
// To dispaly background notifications
if (messaging) {
  try {
    messaging.onBackgroundMessage((payload) => {
      const notificationTitle = payload.notification.title;
      const notificationData = JSON.parse(payload.notification.body);
      // communicate to client
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          // Send a message to the main application
          client.postMessage({
            type: 'notificationData',
            data: notificationData
          });

          client.postMessage({
            type: 'message',
            message: {
              notificationTitle,
              body: notificationData.message
            }
          });
        });
      });

      console.log({ notificationData });
      const notificationOptions = {
        body: notificationData.message,
        requireInteraction: true,
        icon: './MainIcon.png',
        
      };
      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
  } catch (err) {
    console.log(err);
  }
}
