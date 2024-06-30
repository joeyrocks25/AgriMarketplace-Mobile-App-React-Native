import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Formik } from "formik";
import ProfilePhotoPicker from "../components/forms/ProfilePhotoPicker";
import colors from "../config/colors";
import authApi from "../api/auth";
import { deleteUser, updateUser } from "../api/users";
import useAuth from "../auth/useAuth";
import { Alert } from "react-native";

function UserProfile() {
  const { user, logOut } = useAuth();
  const auth = useAuth();

  // State variables
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  // Edit button click handler
  const handleEdit = () => {
    setEditing(true);
  };

  // Save button click handler
  const handleSave = async () => {
    try {
      const result = await updateUser(editedUser.userId, editedUser);
      console.log("User updated successfully.");
      console.log("Updated user:", result.user);
      setEditing(false);

      const result2 = await authApi.login(
        editedUser.email,
        editedUser.password
      );

      // Refresh the authentication token with the updated user information
      console.log("User login after update:", result2.data);
      auth.logIn(result2.data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Inside the handleDelete function
  const handleDelete = async () => {
    try {
      // Show an alert dialog for confirmation
      Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              // Call the deleteUser function from the API module to delete the user
              await deleteUser(user.userId);
              console.log("User deleted successfully.");
              logOut();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Input change handler
  const handleChange = (key, value) => {
    setEditedUser((prevEditedUser) => ({
      ...prevEditedUser,
      [key]: value,
    }));
  };

  // Profile image change handler
  const handleProfileImageChange = (profileImage) => {
    setEditedUser((prevEditedUser) => ({
      ...prevEditedUser,
      profileImage: profileImage,
    }));
  };

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {({ errors, touched }) => (
        <View style={styles.container}>
          <View style={styles.container2}>
            <ProfilePhotoPicker
              name="profileImage"
              initialImage={user.profileImage}
              onChange={handleProfileImageChange}
              errors={errors}
              touched={touched}
            />
          </View>
          {editing ? (
            <>
              <EditableField
                label="Username"
                value={editedUser.username}
                onChange={(value) => handleChange("username", value)}
              />
              <EditableField
                label="Name"
                value={editedUser.name}
                onChange={(value) => handleChange("name", value)}
              />
              <EditableField
                label="Email"
                value={editedUser.email}
                onChange={(value) => handleChange("email", value)}
              />
              <EditableField
                label="Password"
                value={editedUser.password}
                onChange={(value) => handleChange("password", value)}
                secureTextEntry
              />
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ReadOnlyField label="Username" value={user.username} />
              <ReadOnlyField label="Name" value={user.name} />
              <ReadOnlyField label="Email" value={user.email} />
              <ReadOnlyField
                label="Password"
                value={user.password}
                secureTextEntry
              />
              <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>Edit Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </Formik>
  );
}

// Editable input field component
function EditableField({ label, value, onChange, secureTextEntry = false }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

// Read-only input field component
function ReadOnlyField({ label, value, secureTextEntry = false }) {
  const maskedValue = value
    ? secureTextEntry
      ? "*".repeat(value.length)
      : value
    : "";

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={maskedValue}
        editable={false}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 50,
    marginTop: Platform.OS === "ios" ? 100 : 29,
  },
  container2: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.middle_orange,
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default UserProfile;
