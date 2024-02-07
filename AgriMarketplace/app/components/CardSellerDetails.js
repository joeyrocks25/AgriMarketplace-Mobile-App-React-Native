import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Text from "./Text";
import colors from "../config/colors";

function CardSellerDetails({ title, subTitle, imageUrl, onPress }) {
  const cardWidth = 365; // Set the desired width
  const cardHeight = 300; // Shrink the height to half
  const imageWidth = 140; // Set the desired image width
  const imageHeight = 130; // Shrink the image height to half
  const borderRadius = 0; // Set the desired border radius
  console.log("subtitle", subTitle);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.shadowContainer}>
        <View style={[styles.card, { width: cardWidth }]}>
          <View style={styles.imageContainer}>
            <Image
              style={[
                styles.image,
                {
                  width: imageWidth,
                  height: imageHeight,
                  borderRadius: borderRadius,
                },
              ]}
              source={{ uri: imageUrl }}
            />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.textContainer}>
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    backgroundColor: colors.white,
    overflow: "hidden",
    flexDirection: "row",
    padding: 8,
    marginTop: 5,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
    padding: 5,
  },
  textContainer: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 5,
  },
  title: {
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
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.84,
    elevation: 1,
  },
});

export default CardSellerDetails;
