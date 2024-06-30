import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";
import Button from "../components/Button";
import routes from "../navigation/routes";
import colors from "../config/colors";

// WelcomeScreen component displays a welcome screen with a background image,
// logo, tagline, and buttons for navigation.
const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      blurRadius={1}
      style={styles.background}
      source={require("../assets/background-2.jpg")}
    >
      <View style={styles.container}>
        <Text testID="agriMarketplaceText" style={styles.title}>
          AgriMarketplace
        </Text>
        <Image
          testID="logoImage"
          style={styles.logo}
          source={require("../assets/my-logo.png")}
        />
        <Text testID="taglineText" style={styles.tagline}>
          Connecting Farmers. Empowering Agriculture.
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          testID="loginButton"
          title="Login"
          color={colors.light_orange}
          onPress={() => navigation.navigate(routes.LOGIN)}
          outline
        />
        <Button
          testID="registerButton"
          title="Register"
          color={colors.dark_orange}
          onPress={() => navigation.navigate(routes.REGISTER)}
          outline
        />
        <Button testID="guestButton" title="Or continue as guest" />
      </View>
    </ImageBackground>
  );
};

// StyleSheet for styling the WelcomeScreen component
// *****NOTE****
// In React Native, defining styles using the StyleSheet.create() method ensures better performance by precompiling the styles and optimising rendering.
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    marginBottom: 20,
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
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.dark_orange,
    textAlign: "center",
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default WelcomeScreen;
