import React, { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { FontAwesome } from "@expo/vector-icons";

import colors from "../config/colors";
import ContactSellerForm from "../components/ContactSellerForm";
import ListItem from "../components/lists/ListItem";
import Text from "../components/Text";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import useLocation from "../hooks/useLocation";
import DistanceCalculator from "../components/DistanceCalculator";
import listingsApi from "../api/listings";
import usersApi from "../api/users";
import favouritesApi from "../api/favourites";
import useAuth from "../auth/useAuth";

function ListingDetailsScreen({ route }) {
  const listing = route.params;

  const location = useLocation();
  const { user } = useAuth();

  let userLocation = null;
  if (location) {
    userLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  } else {
    console.log("Location is not available");
  }

  const sellerLocation = {
    latitude: listing.location.latitude,
    longitude: listing.location.longitude,
  };

  const distance = userLocation ? (
    <DistanceCalculator location1={sellerLocation} location2={userLocation} />
  ) : null;

  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const handleFavoritePress = async () => {
    try {
      if (isFavorite) {
        console.log("Already favorited.");
        return;
      }

      setLoadingFavorite(true);

      // Create a new favourite object
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

      // Add the favorite
      await favouritesApi.addFavourite(newFavourite);
      console.log("Favorite added");

      setIsFavorite(true);
      setLoadingFavorite(false);
    } catch (error) {
      console.error("Error:", error);
      setLoadingFavorite(false);
    }
  };

  const currentUserId = "123"; // Replace with the actual current user ID

  const userId = listing.userId;

  const [userListingsCount, setUserListingsCount] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [listingDescription, setListingDescription] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingsApi.getListings(userId, null);

        if (response.data.length > 0) {
          setListingDescription(listing.description);
        }

        const userListingsCounts = [
          ...new Set(response.data.map((listing) => listing.userListingsCount)),
        ];

        const count = userListingsCounts.find((count) => count !== undefined);

        setUserListingsCount(count || 0);
      } catch (error) {
        console.log("Error fetching listings:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await usersApi.getUser(userId);
        setUserDetails(response.data);
        console.log("Fetched User:", response.data);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchListings();
    fetchUser();
  }, [userId]);

  const listingsText = userListingsCount === 1 ? "Listing" : "Listings";

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      <Image
        style={styles.image}
        preview={{ uri: listing.images[0].thumbnailUrl }}
        tint="light"
        uri={listing.images[0].url}
      />
      <View style={styles.detailsContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{listing.title}</Text>
          {distance && (
            <View style={styles.locationContainer}>
              <FontAwesome name="map-marker" size={20} color={colors.red} />
              <Text style={styles.distance}>{distance} miles away</Text>
            </View>
          )}
        </View>
        <View style={styles.priceFavoriteContainer}>
          <Text style={styles.price}>£{listing.price}</Text>
          <View style={styles.favoriteContainer}>
            <TouchableWithoutFeedback onPress={handleFavoritePress}>
              <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                size={28}
                color={isFavorite ? "red" : colors.medium}
                style={styles.heartIcon}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
        {listingDescription !== "" && (
          <Text style={styles.description}>{listingDescription}</Text>
        )}
        <View style={{ marginTop: 20 }}>
          {userDetails && (
            <ListItem
              image={require("../assets/profile_photo.png")}
              title={userDetails.username}
              subTitle={`${userListingsCount} ${listingsText}`}
            />
          )}
        </View>
        <View style={[styles.userContainer, { marginTop: 30 }]}></View>
        <ContactSellerForm listing={listing} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  priceFavoriteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    color: colors.dark_green,
    fontWeight: "bold",
    fontSize: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  userContainer: {
    marginVertical: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  distance: {
    marginLeft: 5,
    fontSize: 16,
    color: colors.medium,
  },
  favoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartIcon: {
    marginLeft: 5,
  },
});

export default ListingDetailsScreen;
