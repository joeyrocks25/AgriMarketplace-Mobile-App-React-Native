import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";

import Button from "../components/Button";
import routes from "../navigation/routes";
import colors from "../config/colors";

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={1}
      style={styles.background}
      source={require("../assets/background-2.jpg")}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.tagline2}>AgriMarketplace</Text>
        <Image style={styles.logo} source={require("../assets/my-logo.png")} />
        <Text style={styles.tagline}>
          Connecting Farmers. Empowering Agriculture.
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title="Login"
          color={colors.light_orange}
          onPress={() => navigation.navigate(routes.LOGIN)}
          outline // Add outline prop for white outline
        />
        <Button
          title="Register"
          color={colors.dark_orange}
          onPress={() => navigation.navigate(routes.REGISTER)}
          outline // Add outline prop for white outline
        />
        <Button title="Or continue as guest" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  tagline2: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.dark_orange,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default WelcomeScreen;
