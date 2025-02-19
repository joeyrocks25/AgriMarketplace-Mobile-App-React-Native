import React, { useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useFormikContext } from "formik";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../config/colors";
import ErrorMessage from "./ErrorMessage";

function ProfilePhotoPicker({ name, initialImage }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const imageUri = values[name];

  useEffect(() => {
    if (initialImage) {
      setFieldValue(name, initialImage);
    }
  }, [initialImage, name, setFieldValue]);

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
              size={35}
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
      <ErrorMessage
        error={errors && errors[name]}
        visible={touched && touched[name]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: colors.light_gray,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    overflow: "hidden",
    position: "relative",
    borderWidth: 4,
    borderColor: colors.primary,
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
