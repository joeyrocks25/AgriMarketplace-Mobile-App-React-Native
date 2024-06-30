import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import ActivityIndicator from "../components/ActivityIndicator";
import Card from "../components/Card";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import useLocation from "../hooks/useLocation";
import DistanceCalculator from "../components/DistanceCalculator";
import { BoxShadow } from "react-native-shadow";
import useAuth from "../auth/useAuth";
import favouritesApi from "../api/favourites";

function ListingsScreen({ navigation }) {
  console.log("navaaa", navigation);

  // Hook to retrieve route parameters
  const route = useRoute();

  // Hook to get current location
  const location = useLocation();

  // Extracting category details from route parameters
  const categoryId = route.params?.categoryId;
  const categoryColor = route.params?.categoryColor;
  const categoryName = route.params?.categoryName;
  const { user } = useAuth();

  // Calculating user's location
  let userLocation = null;
  if (location) {
    userLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  } else {
    console.log("Location is not available");
  }

  // Shadow options for category name
  const categoryNameShadowOpt = {
    width:
      Platform.OS === "ios"
        ? Dimensions.get("window").width - 40
        : Dimensions.get("window").width - 80,
    height: 40,
    color: "#000",
    border: 10,
    radius: 15,
    opacity: 0.15,
    x: 0,
    y: 5,
    style: { marginVertical: 10 },
  };

  // API hook to fetch listings
  const getListingsApi = useApi(() =>
    listingsApi.getListings(null, categoryId)
  );

  useEffect(() => {
    getListingsApi.request();
  }, [categoryId]);

  // State for favorites
  const [favorites, setFavorites] = useState([]);

  // Function to handle adding favorites
  const handleFavoritePress = async (listing) => {
    try {
      if (!listing.isButtonDisabled) {
        listing.isButtonDisabled = true;

        const newFavourite = {
          currentUserId: user.userId,
          listingId: listing.id,
          title: listing.title,
          description: listing.description,
          images: listing.images,
          price: listing.price,
          categoryId: listing.categoryId,
          userId: listing.userId,
          location: listing.location,
        };

        await favouritesApi.addFavourite(newFavourite);
        console.log("Favorite added");

        setFavorites([...favorites, listing]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Render component
  return (
    <Screen style={styles.screen}>
      <BoxShadow setting={categoryNameShadowOpt}>
        <View style={[styles.categoryHUD, { backgroundColor: categoryColor }]}>
          <MaterialCommunityIcons
            name="check"
            size={20}
            color={colors.white}
            style={styles.checkIcon}
          />
          <AppText style={styles.categoryText}>{categoryName}</AppText>
        </View>
      </BoxShadow>
      {getListingsApi.loading ? (
        <ActivityIndicator visible={true} />
      ) : (
        <>
          <FlatList
            data={getListingsApi.data}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => {
              console.log("Rendering Listing:", item.title);
              console.log("User Location:", userLocation);
              console.log("Listing Location:", item.location);

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
                  subTitle={
                    <AppText style={styles.price}>
                      <MaterialCommunityIcons
                        name="currency-gbp"
                        size={18}
                        color={colors.dark_green}
                      />
                      {item.price}
                    </AppText>
                  }
                  imageUrl={item.images[0].url}
                  customHeight={200}
                  onPress={() => {
                    // Log the item before navigating
                    console.log(
                      "Navigating to listing details:",
                      item.images[0].url
                    );
                    navigation.navigate(routes.LISTING_DETAILS, { item });
                  }}
                  distance={distance}
                  isFavorite={favorites.some((fav) => fav.id === item.id)}
                  onFavoritePress={() => handleFavoritePress(item)}
                  isButtonDisabled={item.isButtonDisabled}
                />
              );
            }}
          />

          {getListingsApi.error && (
            <View style={styles.errorContainer}>
              <AppText style={styles.errorText}>
                Couldn't retrieve the listings.
              </AppText>
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
    marginBottom: 0,
    maxWidth:
      Platform.OS === "ios"
        ? Dimensions.get("window").width - 10
        : Dimensions.get("window").width - 80,
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
  price: {
    color: colors.dark_green,
  },
});

export default ListingsScreen;
