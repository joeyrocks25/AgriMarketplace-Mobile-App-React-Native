import { useEffect } from "react";
import * as Notifications from "expo-notifications";

import expoPushTokensApi from "../api/expoPushTokens";

export default useNotifications = (notificationListener) => {
  useEffect(() => {
    registerForPushNotifications();

    if (notificationListener)
      Notifications.addNotificationReceivedListener(notificationListener);
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Notification permissions denied");
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "cdad6a95-e8a1-443a-b113-e1e13030e8f0",
      });

      const token = tokenData.data;

      console.log("Push token:", token);

      // Log the request payload before making the API call
      const requestPayload = { token };
      console.log("Register push token request:", requestPayload);

      await expoPushTokensApi.register(token);

      console.log("Push token registration successful");
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };
};
