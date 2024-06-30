import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Yup from "yup";
import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";

// Validation schema for email and password
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

// Login screen component
function LoginScreen(props) {
  const auth = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);

  // Handles form submission
  const handleSubmit = async ({ email, password }) => {
    // Calls the login API
    const result = await authApi.login(email, password);
    // Checks if login is successful
    if (!result.ok) return setLoginFailed(true);
    // Resets loginFailed state if login is successful
    setLoginFailed(false);
    // Logs the user in with the authentication token
    auth.logIn(result.data);
  };

  return (
    <Screen>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          keyboardVerticalOffset={190}
        >
          <Image
            style={styles.logo}
            source={require("../assets/my-logo.png")}
          />
          <Text style={styles.title} testID="title">
            Login
          </Text>
          <Text style={styles.description} testID="description">
            Please sign in to continue
          </Text>

          {/* Form for user login */}
          {auth && (
            <Form
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema} // Add validation schema here
            >
              {/* Error message for failed login */}
              <ErrorMessage
                error="Invalid email and/or password."
                visible={loginFailed}
              />
              {/* Input field for email */}
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                name="email"
                placeholder="Email"
                textContentType="emailAddress"
                testID="emailInput"
              />
              {/* Input field for password */}
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="password"
                placeholder="Password"
                secureTextEntry
                textContentType="password"
                testID="passwordInput"
              />
              {/* Submit button for login */}
              <SubmitButton
                title="Login"
                color={colors.middle_orange}
                style={styles.loginButton}
                testID="loginButton"
              />
            </Form>
          )}
        </KeyboardAvoidingView>
      ) : (
        <Screen style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../assets/my-logo.png")}
          />
          <Text style={styles.title} testID="title">
            Login
          </Text>
          <Text style={styles.description} testID="description">
            Please sign in to continue
          </Text>

          {/* Form for user login */}
          {auth && (
            <Form
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema} // Add validation schema here
            >
              {/* Error message for failed login */}
              <ErrorMessage
                error="Invalid email and/or password."
                visible={loginFailed}
              />
              {/* Input field for email */}
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                name="email"
                placeholder="Email"
                textContentType="emailAddress"
                testID="emailInput"
              />
              {/* Input field for password */}
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="password"
                placeholder="Password"
                secureTextEntry
                textContentType="password"
                testID="passwordInput"
              />
              {/* Submit button for login */}
              <SubmitButton
                title="Login"
                color={colors.middle_orange}
                style={styles.loginButton}
                testID="loginButton"
              />
            </Form>
          )}
        </Screen>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    marginBottom: 120,
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default LoginScreen;
