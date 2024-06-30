import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../../config/colors";
import * as Yup from "yup";
import { Formik } from "formik";

function MessageInput({ onSend }) {
  return (
    <Formik
      initialValues={{ message: "" }}
      onSubmit={(values, { resetForm }) => {
        onSend(values.message);
        resetForm();
      }}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            multiline
            numberOfLines={3}
            onChangeText={handleChange("message")}
            onBlur={handleBlur("message")}
            value={values.message}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
            <FontAwesome name="send" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
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
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.light,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: colors.medium,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    width: '100%', // Set the width to '100%'
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light_orange,
    borderRadius: 20,
    width: 40,
    height: 40,
    width: '100%', // Set the width to '100%'
  },
});

export default MessageInput;
