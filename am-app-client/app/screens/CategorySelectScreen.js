import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useNavigation, useIsFocused } from "@react-navigation/native";

// Define categories with their respective properties
const categories = [
  {
    backgroundColor: colors.livestock,
    icon: "cow",
    label: "Livestock",
    value: 1,
  },
  {
    backgroundColor: colors.machinery,
    icon: "toolbox",
    label: "Machinery",
    value: 2,
  },
  {
    backgroundColor: colors.tractors,
    icon: "tractor",
    label: "Tractors",
    value: 3,
  },
  {
    backgroundColor: colors.cars,
    icon: "car-multiple",
    label: "Cars",
    value: 4,
  },
  {
    backgroundColor: colors.tools,
    icon: "hammer",
    label: "Tools",
    value: 5,
  },
  {
    backgroundColor: colors.other,
    icon: "application",
    label: "Other",
    value: 6,
  },
];

function CategoryHUDScreen({ onScreenFocus }) {
  // Navigation and focus management hooks
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Effect hook to handle screen focus changes
  useEffect(() => {
    onScreenFocus && onScreenFocus(isFocused);
  }, [isFocused, onScreenFocus]);

  // Function to handle category button press
  const handleButtonPress = (category) => {
    navigation.navigate("Listings", {
      categoryId: category.value,
      categoryColor: category.backgroundColor,
      categoryName: category.label,
    });
  };

  // Render component
  return (
    <View style={styles.container}>
      <Text testID="title" style={styles.title}>
        Explore Categories
      </Text>
      <View style={styles.buttonContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.button,
              { backgroundColor: category.backgroundColor },
            ]}
            onPress={() => handleButtonPress(category)}
            testID="categoryButton"
          >
            <MaterialCommunityIcons
              name={category.icon}
              size={80}
              color="white"
            />
            <Text style={styles.label}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.medium,
    marginTop: 70,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 60,
  },
  button: {
    width: Dimensions.get("window").width / 2 - 20,
    aspectRatio: 1,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});

// Export the component and categories array
export default CategoryHUDScreen;
export { categories };
