const { Expo } = require("expo-server-sdk");

const sendPushNotification = async (targetExpoPushToken, message) => {
  const expo = new Expo();
  const chunks = expo.chunkPushNotifications([
    { to: targetExpoPushToken, sound: "default", body: message },
  ]);

  const sendChunks = async () => {
    // Code runs synchronously. Waiting for each chunk to be send.
    // send multiple chunks in parallel. note look at Promise.all() for improvement
    chunks.forEach(async (chunk) => {
      console.log("Sending Chunk", chunk);
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk);
        console.log("Tickets", tickets);
      } catch (error) {
        console.log("Error sending chunk", error);
      }
    });
  };

  await sendChunks();
};

module.exports = sendPushNotification;
