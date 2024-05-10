const runtimeConfig = window.REACT_APP_RUNTIME_CONFIG || {};

const config = {
  AUTH_BASE_URL:
    runtimeConfig.AUTH_BASE_URL || process.env.REACT_APP_SERVER_AUTH_BASE_URL,
  GOOGLE_API_KEY:
    runtimeConfig.GOOGLE_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY,
  VAPID_KEY:
    runtimeConfig.VAPID_KEY || process.env.REACT_APP_FIREBASE_VAPID_KEY,
  TIME_OUT: Number(runtimeConfig.IDLE_TIME || process.env.REACT_APP_IDLE_TIME),

  apiKey: runtimeConfig.apiKey || process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:
    runtimeConfig.authDomain || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:
    runtimeConfig.projectId || process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:
    runtimeConfig.storageBucket ||
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    runtimeConfig.messagingSenderId ||
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: runtimeConfig.appId || process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:
    runtimeConfig.measurementId ||
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
export default config;
