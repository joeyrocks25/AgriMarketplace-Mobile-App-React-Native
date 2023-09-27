import React from "react";
import { Alert, Keyboard } from "react-native";
import { Notifications } from "expo";
import * as Yup from "yup";

import { Form, FormField, SubmitButton } from "./forms";
import messagesApi from "../api/messages";
import colors from "../config/colors";

function ContactSellerForm({ listing }) {
  const handleSubmit = async ({ message }, { resetForm }) => {
    Keyboard.dismiss();

    console.log("message is", message);
    const result = await messagesApi.send(message, listing.id);
    console.log("result is", result);

    if (!result.ok) {
      console.log("Error", result);
      return Alert.alert("Error", "Could not send the message to the seller.");
    }

    resetForm();

    // // Send a local notification
    // const notificationId = await Notifications.presentNotificationAsync({
    //   title: "Message Sent",
    //   body: "Your message was sent to the seller.",
    // });

    // // You can use the notificationId to later dismiss or handle the notification

    // // To dismiss the notification after a certain duration (e.g., 5 seconds)
    // setTimeout(() => {
    //   Notifications.dismissNotificationAsync(notificationId);
    // }, 5000);

    Alert.alert("Success", "Your message was sent to the seller.");

    // Optionally, you can dismiss the alert after a certain duration
    // setTimeout(() => {
    //   Alert.dismiss();
    // }, 5000);
  };

  return (
    <Form
      initialValues={{ message: "" }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <FormField
        maxLength={255}
        multiline
        name="message"
        numberOfLines={3}
        placeholder="Message..."
      />
      <SubmitButton
        title="Contact Seller"
        color={colors.light_orange} // Set the button color to dark_orange
      />
    </Form>
  );
}

// Validation schema for the form
const validationSchema = Yup.object().shape({
  message: Yup.string().required().min(1).label("Message"),
});

export default ContactSellerForm;
