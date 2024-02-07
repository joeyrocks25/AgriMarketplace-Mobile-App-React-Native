import React from "react";
import {
  Alert,
  Keyboard,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import messagesApi from "../api/messages";
import colors from "../config/colors";

function ContactSellerForm({ listing }) {
  console.log("listinggg", listing);
  const handleSend = async ({ message }, { resetForm }) => {
    Keyboard.dismiss();

    console.log("message is", message);
    console.log("listing id is", listing.id);
    const result = await messagesApi.send(message, listing.id);
    console.log("result is", result);

    if (!result.ok) {
      console.log("Error", result);
      return Alert.alert("Error", "Could not send the message to the seller.");
    }

    resetForm();

    Alert.alert("Success", "Your message was sent to the seller.");
  };

  return (
    <Formik
      initialValues={{ message: "" }}
      onSubmit={handleSend}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.messageContainerWrapper}>
            <View style={styles.messageContainer}>
              <TextInput
                style={styles.input}
                placeholder="Hi, is this still available?"
                multiline
                numberOfLines={3}
                onChangeText={handleChange("message")}
                onBlur={handleBlur("message")}
                value={values.message}
              />
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
              <FontAwesome name="send" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

const validationSchema = Yup.object().shape({
  message: Yup.string().required().min(1).label("Message"),
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 10, // Adjusted paddingBottom
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.test2,
  },
  messageContainerWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: Platform.OS === "ios" ? 30 : 5,
  },

  messageContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.test2,
    height: 45,
    marginRight: 10,
    borderRadius: 10,
  },
  input: {
    flex: 1,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light_orange,
    width: 45,
    height: 45,
    borderRadius: 10,
  },
});

export default ContactSellerForm;
