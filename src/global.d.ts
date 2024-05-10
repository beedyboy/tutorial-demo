// // global.d.ts
interface Window {
  REACT_APP_RUNTIME_CONFIG?: {
    AUTH_BASE_URL?: string;
    GOOGLE_API_KEY?: string;
    IDLE_TIME?: string;
    VAPID_KEY?: string;
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;  };
}
