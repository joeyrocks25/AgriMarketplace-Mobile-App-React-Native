// FabButtonCancel.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../../config/colors";
import { useFormikContext } from "formik";

function FabButtonCancel({ title, onPress, style }) {
  const { resetForm } = useFormikContext();

  return (
    <TouchableOpacity
      style={[styles.button, style]} // Removed the dynamic color property
      onPress={() => onPress(resetForm)}
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
    width: "25%",
    borderWidth: 0,
    borderColor: colors.black,
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Mild background color
    bottom: 16,
    left: 16,
    position: 'absolute',
  },
  text: {
    color: colors.white,
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default FabButtonCancel;
