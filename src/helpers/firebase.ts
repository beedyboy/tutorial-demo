import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getMessaging,
  Messaging,
  getToken,
  onMessage,
  isSupported,
  MessagePayload,
} from "firebase/messaging";
import config from "config";

let messaging: Messaging | null = null;
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
};
const UrlFirebaseConfig = new URLSearchParams(firebaseConfig.toString());

// `${config.AUTH_BASE_URL}/firebase-messaging-sw.js?${UrlFirebaseConfig}`;


// Initialize Firebase App and Messaging
export const initializeFirebase = async (): Promise<{
  app: FirebaseApp | null;
  messaging: Messaging | null;
}> => {
  const app: FirebaseApp | null = null;

  try {
    // Check if Firebase is supported in the browser
    if (await isSupported()) {
      const initializedApp = initializeApp(firebaseConfig);
      messaging = getMessaging(initializedApp);

      return { app: initializedApp, messaging };
    } else {
      console.warn("Firebase is not supported in this browser.");
      return { app: null, messaging: null };
    }
  } catch (err) {
    console.error("Error initializing Firebase: ", err);
    return { app, messaging };
  }
};
// Function to request notification permission
export const requestPermission = async (): Promise<boolean> => {
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting permission: ", error);
    return false;
  }
};

export const onMessageListener = (
  messaging: Messaging | null,
  callback: (message: MessagePayload | null) => void
) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    callback(payload);
  });
};

// Get or register service worker
export const getOrRegisterServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (
    "serviceWorker" in navigator &&
    typeof window.navigator.serviceWorker !== "undefined"
  ) {
    try {
      const serviceWorkerRegistration = await window.navigator.serviceWorker.getRegistration(
        "/firebase-push-notification-scope"
      );
      if (serviceWorkerRegistration) return serviceWorkerRegistration;

      const registration = await window.navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/firebase-push-notification-scope",
        }
      );

      return registration;
    } catch (error) {
      console.error("Error getting or registering service worker: ", error);
      return null;
    }
  }

  throw new Error("The browser doesn't support service worker.");
};

// Get Firebase token
export const getFCMToken = async (): Promise<string | undefined> => {
  try {
    if (messaging) {
      const serviceWorkerRegistration = await getOrRegisterServiceWorker();
      if (serviceWorkerRegistration) {
        return await getToken(messaging, {
          vapidKey: config.VAPID_KEY as string,
          serviceWorkerRegistration,
        });
      }
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
  }
  return undefined;
};