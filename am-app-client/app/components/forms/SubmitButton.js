import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFormikContext } from "formik";

import colors from "../../config/colors";

function Button({ title, color, style }) {
  const { handleSubmit } = useFormikContext();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={handleSubmit}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
    borderWidth: 2,
    borderColor: colors.black,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default Button;
