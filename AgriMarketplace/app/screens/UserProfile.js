import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import useAuth from "../auth/useAuth";

function UserProfile() {
  const { user } = useAuth();
  console.log(user);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    // Perform save logic here, e.g., update user data in the backend
    // Once the save is successful, you can set editing to false to exit edit mode
    setEditing(false);
  };

  const handleCancel = () => {
    // Reset editedUser to original user data and exit edit mode
    setEditedUser({ ...user });
    setEditing(false);
  };

  const handleChange = (key, value) => {
    // Update the editedUser object with the modified field value
    setEditedUser((prevEditedUser) => ({
      ...prevEditedUser,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Profile</Text>
      {editing ? (
        <>
          <EditableField
            label="Username"
            value={user.username}
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
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
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
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

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
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
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
    backgroundColor: "blue",
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
