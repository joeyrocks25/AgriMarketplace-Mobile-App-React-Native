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

const validationSchema = Yup.object().shape({});

function RegisterScreen() {
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [error, setError] = useState();

  const handleSubmit = async (userInfo) => {
    const result = await registerApi.request(userInfo);

    if (!result.ok) {
      if (result.data) setError(result.data.error);
      else {
        setError("An unexpected error occurred.");
        console.log(result);
      }
      return;
    }

    const { data: authToken } = await loginApi.request(
      userInfo.email,
      userInfo.password
    );
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
              // validationSchema={validationSchema}
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
