import React, { useState } from "react";
import { StyleSheet, Keyboard } from "react-native";
import * as Yup from "yup";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import listingsApi from "../api/listings";
import useLocation from "../hooks/useLocation";
import UploadScreen from "./UploadScreen";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import colors from "../config/colors";
import useAuth from "../auth/useAuth";

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

function ListingEditScreen() {
  const { user } = useAuth();
  console.log(user);
  const location = useLocation();
  // const [uploadVisible, setUploadVisible] = useState(false);
  // const [progress, setProgress] = useState(0);

  const convertBlobToBase64 = (blob) => {
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
    console.log(listing);
    // setProgress(0);
    // setUploadVisible(true);

    // Extract the categoryId from the category object
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
    console.log(finalListing); // Log the final listing object before sending it to the server

    try {
      const response = await fetch("http://192.168.1.130:9000/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalListing),
      });

      const result = await response.json();

      console.log(result); // Add this line to see the response from the server

      if (!response.ok) {
        setUploadVisible(false);
        return alert("Could not save the listing");
      } else {
        resetForm();
        Alert.alert("Success", "listing posted successfully!");
        Keyboard.dismiss(); // Dismiss the keyboard
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen
      // onDone={() => setUploadVisible(false)}
      // progress={progress}
      // visible={uploadVisible}
      />
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
        <FormImagePicker name="images" />
        <FormField maxLength={255} name="title" placeholder="Title" />
        <FormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder="Price"
          width={120}
        />
        <Picker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton
          title="Post"
          color={colors.light_orange} // Set the button color to dark_orange
        />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
export default ListingEditScreen;
