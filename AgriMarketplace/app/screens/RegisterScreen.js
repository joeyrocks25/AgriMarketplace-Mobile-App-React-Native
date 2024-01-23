import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import * as Yup from "yup";
import Screen from "../components/Screen";
import usersApi from "../api/users";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import ProfilePhotoPicker from "../components/forms/ProfilePhotoPicker";

// Empty validation schema
const validationSchema = Yup.object().shape({});

// Function to convert a Blob to Base64
const convertBlobToBase64 = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
};

function RegisterScreen() {
  const registerApi = useApi(usersApi.registerWithProfilePhoto);
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [error, setError] = useState();

  const handleSubmit = async (userInfo) => {
    const { username, name, email, password, profilePhoto } = userInfo;

    // Convert profile photo to base64
    let profilePhotoBase64 = null;
    if (profilePhoto) {
      const response = await fetch(profilePhoto);
      const blob = await response.blob();
      profilePhotoBase64 = await convertBlobToBase64(blob);
    }

    const userData = {
      username,
      name,
      email,
      password,
      profilePhoto: profilePhotoBase64,
    };

    await registerApi.request(userData);

    console.log("email",email, "password", password)
    const { data: authToken } = await loginApi.request(email, password);
    auth.logIn(authToken);
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
      >
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <Form
              initialValues={{
                username: "",
                name: "",
                email: "",
                password: "",
                profilePhoto: null,
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View style={styles.fieldContainer}>
                <ErrorMessage error={error} visible={error} />
                <View style={styles.profilePhotoContainer}>
                  <ProfilePhotoPicker name="profilePhoto" />
                </View>

                <FormField
                  autoCorrect={false}
                  icon="account"
                  name="username"
                  placeholder="Username"
                />
                <FormField
                  autoCorrect={false}
                  icon="account"
                  name="name"
                  placeholder="Full name"
                />
                <FormField
                  autoCorrect={false}
                  icon="email"
                  name="email"
                  placeholder="Email"
                />
                <FormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="lock"
                  name="password"
                  placeholder="Password"
                  secureTextEntry
                  textContentType="password"
                />
              </View>
              <SubmitButton
                title="Register"
                color={colors.middle_orange}
                style={styles.registerButton}
              />
            </Form>
          </View>
          <ActivityIndicator
            visible={registerApi.loading || loginApi.loading}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 50,
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  profilePhotoContainer: {
    alignItems: "center", // Center horizontally
    marginBottom: 80,
  },
  registerButton: {
    // Add any additional styles for the register button if needed
  },
});

export default RegisterScreen;
