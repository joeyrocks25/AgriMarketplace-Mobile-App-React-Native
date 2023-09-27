import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";

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

function CategoryHUDScreen() {
  const navigation = useNavigation();

  const handleButtonPress = (category) => {
    navigation.navigate("Feed", {
      screen: "Listings",
      params: {
        categoryId: category.value,
        categoryColor: category.backgroundColor,
        categoryName: category.label,
      },
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
    backgroundColor: "white",
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
