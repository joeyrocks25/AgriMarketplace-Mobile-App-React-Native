import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Text from "./Text";
import colors from "../config/colors";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import listingsApi from "../api/listings";
import favouritesApi from "../api/favourites";

const CardBin = ({
  title,
  subTitle,
  imageUrl,
  onPress,
  customHeight,
  distance,
  listingId,
  iconName,
  favouriteId,
  setRefreshKey,
}) => {
  const handleDeletePress = async () => {
    try {
      if (iconName === "heart") {
        await favouritesApi.deleteFavouriteById(favouriteId);
        console.log("Favourite deleted successfully!");
        // Call onDelete after successfully deleting the favourite
        setRefreshKey((prevKey) => prevKey + 1);
      } else {
        // Delete the listing
        await listingsApi.deleteListingById(listingId);
        console.log("listingid", listingId);
        console.log("Listing deleted successfully!");
        setRefreshKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <Image
          style={[styles.image, { height: customHeight }]}
          source={{ uri: imageUrl }}
        />
        <View style={styles.iconContainer}>
          <TouchableWithoutFeedback onPress={handleDeletePress}>
            <View style={styles.iconButton}>
              {iconName === "heart" ? (
                <AntDesign
                  name="heart"
                  size={24}
                  color={colors.red}
                  style={styles.deleteIcon}
                />
              ) : (
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={colors.red}
                  style={styles.deleteIcon}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {distance && (
              <View style={styles.locationContainer}>
                <AntDesign name="heart" size={20} color={colors.red} />
                <Text style={styles.distance}>{distance} miles away</Text>
              </View>
            )}
          </View>
          <View style={styles.subTitleContainer}>
            <Text style={styles.subTitle} numberOfLines={2}>
              {subTitle}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
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
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: colors.white,
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.white,
    marginLeft: 10,
    zIndex: 1, // Ensure icon is above the image
  },
  deleteIcon: {
    marginLeft: 1,
  },
});

export default CardBin;
