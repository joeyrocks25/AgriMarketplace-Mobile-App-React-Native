import React from "react";
import { View, StyleSheet, Image, TouchableWithoutFeedback } from "react-native";
import Text from "./Text";
import colors from "../config/colors";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import listingsApi from "../api/listings";

const Card = ({ title, subTitle, imageUrl, onPress, customHeight, distance, listingId, onDelete }) => {
  const handleDeletePress = async () => {
    try {
      await listingsApi.deleteListingById(listingId);
      console.log("Listing deleted successfully!");
      onDelete();
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <Image
          style={[styles.image, { height: customHeight }]}
          source={{ uri: imageUrl }}
        />
        <View style={styles.detailsContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {distance && (
              <View style={styles.locationContainer}>
                <FontAwesome name="map-marker" size={20} color="red" />
                <Text style={styles.distance}>{distance} miles away</Text>
              </View>
            )}
          </View>
          <View style={styles.subTitleContainer}>
            <Text style={styles.subTitle} numberOfLines={2}>
              {subTitle}
            </Text>
            <TouchableWithoutFeedback onPress={handleDeletePress}>
              <View style={styles.deleteButton}>
                <AntDesign
                  name="delete"
                  size={28}
                  color={colors.red}
                  style={styles.deleteIcon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
    height: 300,
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    flex: 1,
  },
  subTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle: {
    color: colors.dark_green,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  distance: {
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.white,
  },
  deleteIcon: {
    marginLeft: 2,
  },
});

export default Card;
