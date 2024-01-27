import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Image as RNImage
} from "react-native";
import { Image as ExpoImage } from "react-native-expo-image-cache";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import ContactSellerForm from "../components/ContactSellerForm";
import ListItem from "../components/lists/ListItem";
import Text from "../components/Text";
import { TouchableWithoutFeedback as RNGHTouchableWithoutFeedback } from "react-native-gesture-handler";
import useLocation from "../hooks/useLocation";
import DistanceCalculator from "../components/DistanceCalculator";
import listingsApi from "../api/listings";
import usersApi from "../api/users";
import favouritesApi from "../api/favourites";
import useAuth from "../auth/useAuth";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Screen from "../components/Screen";


// Custom Avatar Component
function CustomAvatar({ imageUri, username, userListingsCount }) {
  const listingsText = userListingsCount === 1 ? "Listing" : "Listings";

  return (
    <View style={styles.container2}>
      <View style={styles.avatarContainer}>
        <RNImage source={{ uri: imageUri }} style={styles.avatar} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.userListingsCount}>
          {userListingsCount} {listingsText}
        </Text>
      </View>
    </View>
  );
}


function ListingDetailsScreen({ route, onScreenFocus }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { item, origin } = route.params;
  // console.log("item is..", item)

  const location = useLocation();
  const { user } = useAuth();

  let userLocation = null;

  useEffect(() => {
    if (isFocused) {
      console.log("ListingDetailsScreen is focused1");
      onScreenFocus && onScreenFocus(true);
    } else {
      console.log("ListingDetailsScreen is unfocused1");
      onScreenFocus && onScreenFocus(false);
    }
  }, [isFocused, onScreenFocus]);

  if (location) {
    userLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  } else {
    console.log("Location is not available");
  }

  const sellerLocation = {
    latitude: item.location.latitude,
    longitude: item.location.longitude,
  };

  const distance = userLocation ? (
    <DistanceCalculator
      location1={sellerLocation}
      location2={userLocation}
    />
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

      const newFavourite = {
        currentUserId: user.userId,
        listingId: item.id,
        title: item.title,
        description: item.description,
        images: item.images,
        price: item.price,
        categoryId: item.categoryId,
        userId: item.userId,
        location: item.location,
      };

      await favouritesApi.addFavourite(newFavourite);
      console.log("Favorite added");

      setIsFavorite(true);
      setLoadingFavorite(false);
    } catch (error) {
      console.error("Error:", error);
      setLoadingFavorite(false);
    }
  };

  const userId = item.userId;
  console.log("uzrrrr id", userId)

  const [userListingsCount, setUserListingsCount] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [listingDescription, setListingDescription] = useState("");
  

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingsApi.getListings(userId, null);

        if (response.data.length > 0) {
          setListingDescription(item.description);
        }

        const userListingsCounts = [
          ...new Set(
            response.data.map((listing) => listing.userListingsCount)
          ),
        ];

        const count = userListingsCounts.find(
          (count) => count !== undefined
        );

        setUserListingsCount(count || 0);
        // console.log("responseeee", response)
      } catch (error) {
        console.log("Error fetching listings:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await usersApi.getUser(userId);
        setUserDetails(response);
        console.log("Fetched User:", response.data);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchListings();
    fetchUser();
  }, [userId, isFocused]);

  

  const [formVisible, setFormVisible] = useState(false);

  return (
    // <Screen style={styles.screen}>
      <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ExpoImage
          style={styles.image}
          preview={{ uri: item.images[0].thumbnailUrl }}
          tint="light"
          uri={item.images[0].url}
        />
        <View style={styles.detailsContainer}>
          
          <View style={styles.titleContainer}>
            <View style={styles.titleFavoriteContainer}>
              <Text style={styles.title}>{item.title}</Text>
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
            {distance && (
              <View style={styles.locationContainer}>
                <FontAwesome name="map-marker" size={20} color={colors.black} />
                <Text style={ colors.black }>  {distance} miles away</Text>
              </View>
            )}
          </View>
          <View style={styles.priceFavoriteContainer}>
          <Text style={styles.price}>
            <MaterialCommunityIcons name="currency-gbp" size={18} color={colors.black} />{item.price}
          </Text>
        </View>
          {listingDescription !== "" && (
            <Text style={styles.description}>{listingDescription}</Text>
          )}
        </View>
          <View style={{ marginTop: 20 }}>
            {userDetails && (
              <React.Fragment>
                {/* Log userDetails and related properties */}
                {console.log("UserDetails:", userDetails.data)}
                {console.log("Profile Image URL:", userDetails.data.profileImage)}

                <CustomAvatar
                  imageUri={userDetails.data.profileImage} // Assuming you have a profile image URL in userDetails.data
                  username={userDetails.data.username}
                  userListingsCount={userListingsCount}
                />
              </React.Fragment>
            )}
          <RNGHTouchableWithoutFeedback
            onPress={() => setFormVisible(true)}
          >
            <View style={styles.userContainer}></View>
          </RNGHTouchableWithoutFeedback>
        </View>
      </ScrollView>
      <View style={styles.ContactSellerForm}>
        <ContactSellerForm
          listing={item}
          visible={formVisible}
          onClose={() => setFormVisible(false)}
        />
      </View>
    </View>
    // </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.test,
    
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: colors.white,
  },
  ContactSellerForm: {
    backgroundColor: colors.white,
  },
  container2: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 5,
  },
  avatarContainer: {
    borderColor: colors.middle_orange,
    borderWidth: 2,
    borderRadius: 37.5,
    overflow: "hidden",
    width: 60,
    height: 60,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 37.5,
  },
  textContainer: {
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
    // backgroundColor: "black",
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
    color: colors.black,
    // fontWeight: "bold",
    fontSize: 20,
  },
  titleContainer: {
    flexDirection: "column",
    marginBottom: 10,
  },
  titleFavoriteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "500",
  },
  favoriteContainer: {
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -3,
  },
  distance: {
    marginLeft: 5,
    fontSize: 16,
    color: colors.medium,
  },
  description: {
    fontSize: 16,
    // marginTop: 5,
  },
  userContainer: {
    marginVertical: 20,
    height: 50,
  },
  heartIcon: {
    marginLeft: 5,
  },
});

export default ListingDetailsScreen;