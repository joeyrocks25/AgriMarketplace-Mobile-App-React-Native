import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Text from "./Text";
import colors from "../config/colors";

function CardSuggestions({ title, subTitle, imageUrl, onPress }) {
  const cardWidth = 160; // Set the desired width
  const cardHeight = 150; // Shrink the height to half
  const imageHeight = 90; // Shrink the image height to half

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.card, { width: cardWidth }]}>
        <Image
          style={[styles.image, { height: imageHeight }]}
          source={{ uri: imageUrl }}
        />
        <View style={styles.detailsContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
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
}

const styles = StyleSheet.create({
  card: {
    // borderRadius: 9,
    backgroundColor: colors.white,
    // marginBottom: 20,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 5,
  },
  image: {
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    flex: 1,
    fontSize: 14,
  },
  subTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle: {
    color: colors.black,
    fontWeight: "500",
    flex: 1,
    marginRight: 5,
    fontSize: 12,
  },
});

export default CardSuggestions;
