import React from "react";
import { StyleSheet, Keyboard, Alert, View, Platform } from "react-native";
import { FAB } from "react-native-paper";
import * as Yup from "yup";
import { Form, FormField, FormPicker as Picker } from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import listingsApi from "../api/listings";
import useLocation from "../hooks/useLocation";
import UploadScreen from "./UploadScreen";
import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import FabButton from "../components/forms/FabButton";
import FabButtonCancel from "../components/forms/FabButtonCancel";
import defaultStyles from "../config/styles";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(0, "Please select at least one image."),
});

const categories = [
  {
    backgroundColor: "#fc5c65",
    icon: "cow",
    label: "Livestock",
    value: 1,
  },
  {
    backgroundColor: "#fd9644",
    icon: "toolbox",
    label: "Machinery",
    value: 2,
  },
  {
    backgroundColor: "#fed330",
    icon: "tractor",
    label: "Tractors",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "car-multiple",
    label: "Cars",
    value: 4,
  },
  {
    backgroundColor: "#2bcbba",
    icon: "hammer",
    label: "Tools",
    value: 5,
  },
  {
    backgroundColor: "#778ca3",
    icon: "application",
    label: "Other",
    value: 6,
  },
];

function ListingEditScreen({ navigation }) {
  const { user } = useAuth();
  const location = useLocation();

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

  const handleSubmit = async (listing, { resetForm }) => {
    const { category, ...rest } = listing;
    const categoryId = category ? category.value : null;

    let images = [];
    if (listing.images.length > 0) {
      // Convert the image to base64
      images = await Promise.all(
        listing.images.map(async (imageUri) => {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const base64 = await convertBlobToBase64(blob);
          return base64;
        })
      );
    }

    const finalListing = {
      ...rest,
      categoryId,
      images: images || [],
      location,
      userId: user.userId,
    };

    try {
      const result = await listingsApi.addListing(finalListing);

      resetForm();
      Alert.alert("Success", "Listing posted successfully!");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Could not save the listing");
    }
  };

  const handleCancel = (resetForm) => {
    // Reset the form to initial values
    resetForm();
    Keyboard.dismiss();
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen />
      <Form
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <View style={styles.upperContainer}>
          <View style={styles.upperContainer2}>
            <FormImagePicker name="images" />
          </View>
          <FormField maxLength={55} name="title" placeholder="Title" />
          <FormField
            keyboardType="numeric"
            maxLength={8}
            name="price"
            placeholder="Price (£)"
            width="100%"
          />
          <Picker
            items={categories}
            name="category"
            numberOfColumns={3}
            PickerItemComponent={CategoryPickerItem}
            placeholder="Category"
            width="100%"
          />
          <FormField
            maxLength={255}
            multiline
            name="description"
            numberOfLines={3}
            placeholder="Description"
            style={styles.descriptionInput}
          />
        </View>
        <FabButton
          title="Post"
          color={colors.light_orange}
          onPress={handleSubmit}
        />
        <FabButtonCancel
          title="Cancel"
          color={colors.gray}
          onPress={handleCancel}
        />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.test,
  },
  upperContainer: {
    marginTop: Platform.OS === "ios" ? 20 : -5,
  },
  upperContainer2: {
    marginBottom: 10,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: "top",
    fontSize: 18,
    ...defaultStyles.text,
  },
});

export default ListingEditScreen;
