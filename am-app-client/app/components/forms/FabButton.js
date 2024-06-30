import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFormikContext } from "formik";

import colors from "../../config/colors";

function FabButton({ title, color, style }) {
  const { handleSubmit } = useFormikContext();

  return (
    <TouchableOpacity
      style={[styles.fabButton, { backgroundColor: color }, style]}
      onPress={handleSubmit}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fabButton: {
    width: "25%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    position: "absolute",
    bottom: 16,
    right: 16,
    elevation: 5, // For Android shadow
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default FabButton;
