import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../config/colors";
import ErrorMessage from "./ErrorMessage";

function ProfilePhotoPicker({ name }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const imageUri = values[name];

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        // Access the first selected asset's URI
        setFieldValue(name, result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image", error);
    }
  };

  const handleRemoveImage = () => {
    setFieldValue(name, null);
  };

  return (
    <>
      <View style={styles.container}>
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <MaterialCommunityIcons
              name="close-circle"
              size={45}
              color={colors.danger}
              style={styles.removeIcon}
              onPress={handleRemoveImage}
            />
          </View>
        ) : (
          <TouchableOpacity onPress={handlePickImage}>
            <MaterialCommunityIcons
              name="camera"
              size={40}
              color={colors.medium_gray}
            />
          </TouchableOpacity>
        )}
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: 180,
    height: 180,
    borderRadius: 80,
    backgroundColor: colors.light_gray,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    overflow: "hidden",
    position: "relative",
    borderWidth: 4, // Add border width
    borderColor: colors.primary, // Add border color
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeIcon: {
    position: "absolute",
    top: 22,
    right: 22,
  },
});

export default ProfilePhotoPicker;