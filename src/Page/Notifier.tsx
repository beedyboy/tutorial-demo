import {
  getFCMToken,
  initializeFirebase,
  onMessageListener,
  requestPermission,
} from "helpers/firebase";
import { useEffect, useState } from "react";

const Notifier = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const notifyUser = (payload: any) => {
    const { notification } = payload;
    if (notification && notification.body) {
      try {
        const cleanedData = JSON.parse(notification.body);
        cleanedData.read = false;
        setNotifications(cleanedData);
      } catch (error) {
        console.error("Error parsing notification body:", error);
      }
    }
  };

  const initializeApp = async () => {
    const { app, messaging } = await initializeFirebase();
    if (app && messaging) {
      // Request notification permission
      const permission = await requestPermission();
      if (permission) {
        // Set the Firebase Messaging instance
        handlegetFCMToken();
        onMessageListener(messaging, notifyUser);
      }
    }
  };

  const handlegetFCMToken = () => {
    try {
      getFCMToken().then((firebaseToken) => {
        if (firebaseToken) {
          const payload = {
              device_token: firebaseToken,
              device_type: 'web'
          };
            console.log({ payload })
            // send to backend
            // use fetch to send to the backend
            fetch('http://localhost:8024/notification/enable', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });
            //
            // or use axios
        }
      });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  useEffect(() => {
    initializeApp();

    const handleServiceWorkerMessage = (event: {
      data: { type: string; notification: any; data: any };
    }) => {
      if (event.data && event.data.type === "message") {
        notifyUser(event.data);
      }
    };

    navigator.serviceWorker.addEventListener(
      "message",
      handleServiceWorkerMessage
    );

    return () => {
      // Remove the removed event listener here
      navigator.serviceWorker.removeEventListener(
        "message",
        handleServiceWorkerMessage
      );
    };
  }, [initializeApp]);
    
  const total = notifications.length;
  return (
    <div>
      <span>Total messages: {total}</span>
    </div>
  );
};

export default Notifier;
