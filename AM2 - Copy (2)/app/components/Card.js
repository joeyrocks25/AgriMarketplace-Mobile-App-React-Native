import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions, // Import Dimensions
} from "react-native";
import Text from "./Text";
import colors from "../config/colors";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { BoxShadow } from "react-native-shadow";

function Card({ title, subTitle, imageUrl, onPress, customHeight, distance }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    // Perform additional action or logic here
  };

  // Calculate the shadow's width based on the card's width
  const cardWidth = Dimensions.get("window").width - 40; // Adjust as needed
  const shadowWidth = "101%";

  const shadowOpt = {
    width: shadowWidth, // Set the shadow's width dynamically
    height: 300,
    color: "#000",
    border: 10,
    radius: 15,
    opacity: 0.2,
    x: 0,
    y: 6,
    style: { marginVertical: 20 },
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <BoxShadow setting={shadowOpt}>
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
          </View>
        </View>
      </BoxShadow>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 9,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
    height: 300,
    width: "100%",
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
});

export default Card;
