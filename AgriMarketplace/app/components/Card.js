import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Text from "./Text";
import colors from "../config/colors";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { BoxShadow } from "react-native-shadow";

function Card({
  title,
  subTitle,
  imageUrl,
  onPress,
  customHeight,
  distance,
  isFavorite,
  onFavoritePress, // Receive favorite press handler
}) {
  const cardWidth = Dimensions.get("window").width - (Platform.OS === "android" ? 80 : 40);
  const shadowWidth = cardWidth;

  const shadowOpt = {
    width: shadowWidth,
    height: 300,
    color: "#000",
    border: 20,
    radius: 30,
    opacity: 0.07,
    x: 0,
    y: 5,
    style: { marginVertical: 13 },
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View>
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

                <TouchableWithoutFeedback onPress={onFavoritePress}>
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
      </View>
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
    backgroundColor: "transparent",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    backgroundColor: "transparent",
  },
  heartIcon: {
    marginLeft: 2,
  },
});

export default Card;
