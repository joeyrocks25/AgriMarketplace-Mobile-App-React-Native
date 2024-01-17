import React, { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useNavigation, useIsFocused } from "@react-navigation/native";

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
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("CategorySelectScreen is focused2");
      onScreenFocus && onScreenFocus(true);
    } else {
      console.log("CategorySelectScreen is unfocused2");
      onScreenFocus && onScreenFocus(false);
    }
  }, [isFocused, onScreenFocus]);

  const handleButtonPress = (category) => {
    navigation.navigate("Listings", {
      categoryId: category.value,
      categoryColor: category.backgroundColor,
      categoryName: category.label,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Categories</Text>
      <View style={styles.buttonContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.button,
              { backgroundColor: category.backgroundColor },
            ]}
            onPress={() => handleButtonPress(category)}
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
    marginBottom: 0,
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

export default CategoryHUDScreen;
