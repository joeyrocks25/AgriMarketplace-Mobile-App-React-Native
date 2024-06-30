import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
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

// Validation schema for registration form fields
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

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

/**
 * RegisterScreen Component
 * Handles user registration
 */
function RegisterScreen() {
  const registerApi = useApi(usersApi.registerWithProfilePhoto);
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [error, setError] = useState();
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [termsOfServiceAccepted, setTermsOfServiceAccepted] = useState(false);
  const [hidePassword, setHidePassword] = useState(true); // State to toggle password visibility

  /**
   * Handles form submission
   * @param {Object} userInfo - User information submitted via form
   * Uses Register Api for creating account
   * Uses Auth Api for login after creating account
   */
  const handleSubmit = async (userInfo) => {
    const { username, name, email, password, profilePhoto } = userInfo;

    let userData = {
      username,
      name,
      email,
      password,
    };

    if (profilePhoto) {
      const response = await fetch(profilePhoto);
      const blob = await response.blob();
      const profilePhotoBase64 = await convertBlobToBase64(blob);
      userData = { ...userData, profilePhoto: profilePhotoBase64 };
    }

    try {
      await registerApi.request(userData);

      console.log("email", email, "password", password);
      const { data: authToken } = await loginApi.request(email, password);
      auth.logIn(authToken);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 110}
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
                  <ProfilePhotoPicker
                    name="profilePhoto"
                    testID="profilePhotoPicker"
                  />
                </View>

                <FormField
                  autoCorrect={false}
                  icon="account"
                  name="username"
                  placeholder="Username"
                  testID="usernameInput"
                />
                <FormField
                  autoCorrect={false}
                  icon="account"
                  name="name"
                  placeholder="Full name"
                  testID="nameInput"
                />
                <FormField
                  autoCorrect={false}
                  icon="email"
                  name="email"
                  placeholder="Email"
                  testID="emailInput"
                />
                <View style={styles.passwordContainer}>
                  <FormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="lock"
                    name="password"
                    placeholder="Password"
                    secureTextEntry={hidePassword} // Toggle secureTextEntry based on hidePassword state
                    textContentType="password"
                    testID="passwordInput"
                    style={[styles.passwordInput, styles.input]}
                  />
                  {/* Eye icon to toggle password visibility */}
                  <TouchableOpacity
                    onPress={() => setHidePassword(!hidePassword)}
                    style={styles.eyeIcon}
                  >
                    <Text>{hidePassword ? "👁️" : "🙈"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  onPress={() => setIsChecked(!isChecked)}
                  style={[styles.checkbox, isChecked && styles.checked]}
                >
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <Text style={styles.label}>
                  I agree to the{" "}
                  <Text
                    style={styles.link}
                    onPress={() => setPrivacyModalVisible(true)}
                  >
                    Privacy Policy
                  </Text>{" "}
                  and{" "}
                  <Text
                    style={styles.link}
                    onPress={() => setTermsModalVisible(true)}
                  >
                    Terms of Service
                  </Text>
                  .
                </Text>
              </View>
              <SubmitButton
                title="Register"
                color={colors.middle_orange}
                style={styles.registerButton}
                testID="registerButton"
                disabled={!privacyPolicyAccepted || !termsOfServiceAccepted}
              />
            </Form>
          </View>
          <ActivityIndicator
            visible={registerApi.loading || loginApi.loading}
          />
        </View>
      </KeyboardAvoidingView>

      <PrivacyPolicyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
        onAccept={() => setPrivacyPolicyAccepted(true)}
      />

      <TermsOfServiceModal
        visible={termsModalVisible}
        onClose={() => setTermsModalVisible(false)}
        onAccept={() => setTermsOfServiceAccepted(true)}
      />
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
    marginBottom: 30,
  },
  profilePhotoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  registerButton: {
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.dark_orange,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: colors.dark_orange,
  },
  checkmark: {
    color: "#fff",
  },
  label: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.grey,
  },
  link: {
    color: colors.dark_orange,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.light_grey,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});

// Modal styles
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: colors.dark_orange,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

// Privacy Policy modal content
const PrivacyPolicyModal = ({ visible, onClose, onAccept }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>
            **Privacy Policy**
            {"\n\n"}
            1. **Introduction** Welcome to our Privacy Policy. Your privacy is
            important to us. This policy explains how we collect, use, and
            safeguard your personal information.
            {"\n\n"}
            2. **Information Collection and Use**
            {"\n"}- We collect personal information for various purposes,
            including but not limited to providing and improving our services.
            {"\n"}- The types of information collected may include name, email
            address, contact preferences, and usage data.
            {"\n\n"}
            3. **Data Security**
            {"\n"}- We take appropriate measures to protect the security of your
            personal information.
            {"\n"}- However, please note that no method of transmission over the
            internet or electronic storage is 100% secure.
            {"\n\n"}
            4. **Cookies**
            {"\n"}- We may use cookies and similar tracking technologies to
            track activity on our website and hold certain information.
            {"\n\n"}
            5. **Third-party Links**
            {"\n"}- Our website may contain links to third-party websites that
            are not operated by us. We have no control over and assume no
            responsibility for the content, privacy policies, or practices of
            any third-party sites or services.
          </Text>
          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={() => {
              onClose();
              onAccept();
            }}
          >
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Terms of Service modal content
const TermsOfServiceModal = ({ visible, onClose, onAccept }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>
            **Terms of Service**
            {"\n\n"}
            1. **Introduction** Welcome to our service! These terms govern your
            use of our website and services. By accessing or using our services,
            you agree to be bound by these terms.
            {"\n\n"}
            2. **Account Registration**
            {"\n"}- You may be required to create an account to access certain
            features of our services.
            {"\n"}- You are responsible for maintaining the confidentiality of
            your account credentials and for any activity that occurs under your
            account.
            {"\n\n"}
            3. **Content Ownership**
            {"\n"}- You retain ownership of any content you submit or upload to
            our services.
            {"\n"}- By submitting content, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify,
            adapt, publish, translate, distribute, and display such content.
            {"\n\n"}
            4. **Limitation of Liability**
            {"\n"}- We shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising out of or in any
            way connected with your use of our services.
            {"\n\n"}
            5. **Changes to Terms**
            {"\n"}- We reserve the right to modify or replace these terms at any
            time. Continued use of our services after any such changes shall
            constitute your consent to such changes.
          </Text>
          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={() => {
              onClose();
              onAccept();
            }}
          >
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RegisterScreen;
