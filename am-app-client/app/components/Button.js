import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

// import colors from "../config/colors";

function AppButton({ title, onPress, color, outline = false }) {
  const buttonStyle = [
    styles.button,
    { backgroundColor: color },
    outline && styles.outline,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
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
  },
  outline: {
    borderWidth: 3,
    borderColor: "black",
  },
  text: {
    color: "white",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
