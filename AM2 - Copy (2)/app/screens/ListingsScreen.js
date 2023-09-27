import React, { useEffect } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import Card from "../components/Card";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import useApi from "../hooks/useApi";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import useLocation from "../hooks/useLocation";
import DistanceCalculator from "../components/DistanceCalculator";

function ListingsScreen({ navigation }) {
  const route = useRoute();
  const location = useLocation();
  const categoryId = route.params?.categoryId;
  const categoryColor = route.params?.categoryColor;
  const categoryName = route.params?.categoryName;

  let userLocation = null;
  if (location) {
    userLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  } else {
    console.log("Location is not available");
  }

  // console.log("User Location:", userLocation); // Log userLocation here

  const getListingsApi = useApi(() =>
    listingsApi.getListings(null, categoryId)
  );

  useEffect(() => {
    getListingsApi.request();
  }, [categoryId]);

  return (
    <Screen style={styles.screen}>
      <View style={[styles.categoryHUD, { backgroundColor: categoryColor }]}>
        <MaterialCommunityIcons
          name="check"
          size={20}
          color={colors.white}
          style={styles.checkIcon}
        />
        <AppText style={styles.categoryText}>{categoryName}</AppText>
      </View>
      {getListingsApi.loading ? (
        <ActivityIndicator visible={true} />
      ) : (
        <>
          <FlatList
            data={getListingsApi.data}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => {
              console.log("Rendering Listing:", item.title); // Log the title of the listing being rendered
              console.log("User Location:", userLocation); // Log userLocation here
              console.log("Listing Location:", item.location); // Log item.location here

              const distance =
                userLocation && item.location ? (
                  <DistanceCalculator
                    location1={item.location}
                    location2={userLocation}
                  />
                ) : null;

              return (
                <Card
                  title={item.title}
                  subTitle={"£" + item.price}
                  subTitleStyle={styles.price}
                  imageUrl={item.images[0].url}
                  customHeight={200}
                  onPress={() =>
                    navigation.navigate(routes.LISTING_DETAILS, item)
                  }
                  distance={distance}
                />
              );
            }}
          />

          {getListingsApi.error && (
            <View style={styles.errorContainer}>
              <AppText style={styles.errorText}>
                Couldn't retrieve the listings.
              </AppText>
              <Button
                title="Retry"
                onPress={getListingsApi.request}
                style={styles.retryButton}
              />
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  categoryHUD: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  checkIcon: {
    marginRight: 10,
  },
  categoryText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    alignSelf: "center",
  },
  price: {
    color: colors.dark_green,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  distance: {
    marginLeft: 5,
  },
});

export default ListingsScreen;
