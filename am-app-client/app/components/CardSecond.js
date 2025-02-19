import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Text from "./Text";
import colors from "../config/colors";
import { FontAwesome, AntDesign } from "@expo/vector-icons";

function CardSecond({
  title,
  subTitle,
  imageUrl,
  onPress,
  customHeight,
  distance,
  description,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    // Perform additional action or logic here
  };

  // Ensure that imageUrl is properly extracted if it's nested within an object
  const imageUrlFromItem = imageUrl && imageUrl.url ? imageUrl.url : imageUrl;
  console.log("Image URL from Item:", imageUrlFromItem); // Add this line to log the image URL

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <Image
          style={[styles.image, { height: customHeight }]}
          source={{ uri: imageUrlFromItem }}
          onError={(error) => console.error("Image Load Error:", error)}
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

            <TouchableWithoutFeedback onPress={handleFavoritePress}>
              <View
                style={[
                  styles.heartButton,
                  isFavorite && styles.favoriteButton,
                ]}
              >
                <AntDesign
                  name={isFavorite ? "heart" : "hearto"}
                  size={28}
                  color={isFavorite ? "red" : "red"}
                  style={styles.heartIcon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {description && (
            <Text style={styles.description}>{description}</Text> // Display description if available
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginTop: 400,
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
  heartButton: {
    backgroundColor: colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.white,
  },
  favoriteButton: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  heartIcon: {
    marginLeft: 2,
  },
  description: {
    marginTop: 10,
    color: colors.medium,
  },
});

export default CardSecond;
