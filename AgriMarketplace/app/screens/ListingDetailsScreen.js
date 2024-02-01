import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Image as RNImage,
} from "react-native";
import ActivityIndicator from "../components/ActivityIndicator";
import { Image as ExpoImage } from "react-native-expo-image-cache";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import ContactSellerForm from "../components/ContactSellerForm";
import Text from "../components/Text";
import { TouchableWithoutFeedback as RNGHTouchableWithoutFeedback } from "react-native-gesture-handler";
import useLocation from "../hooks/useLocation";
import DistanceCalculator from "../components/DistanceCalculator";
import listingsApi from "../api/listings";
import usersApi from "../api/users";
import favouritesApi from "../api/favourites";
import useAuth from "../auth/useAuth";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import CardSuggestions from "../components/CardSuggestions";
import routes from "../navigation/routes";

function CustomAvatar({ imageUri, username, userListingsCount }) {
  const listingsText = userListingsCount === 1 ? "Listing" : "Listings";

  return (
    <View style={styles.shadowContainer}>
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
    </View>
  );
}

function ListingDetailsScreen({ route, onScreenFocus }) {
  const scrollViewRef = useRef();
  const categoryId = route.params?.item?.categoryId;
  console.log("category iddeeddd", categoryId);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { item, origin } = route.params;
  const location = useLocation();
  const { user } = useAuth();
  let userLocation = null;

  const getListingsApi = useApi(() =>
    listingsApi.getListings(null, categoryId)
  );

  useEffect(() => {
    getListingsApi.request();
  }, [categoryId]);

  useEffect(() => {
    if (isFocused) {
      console.log("ListingDetailsScreen is focused1");
      onScreenFocus && onScreenFocus(true);
      // Scroll to the top of the screen when the screen is focused
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
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

  const handleLookingForHaulersPress = () => {
    console.log("Clicked on 'Looking for local haulers'");
  };

  const userId = item.userId;
  console.log("uzrrrr id", userId);

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
        setUserDetails(response);
        console.log("Fetched User:", response.data);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchListings();
    fetchUser();
  }, [userId, isFocused, categoryId]); // Include categoryId in the dependency array

  const [formVisible, setFormVisible] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescriptionLines = () => {
    setShowFullDescription((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <ExpoImage
          style={styles.image}
          preview={{ uri: item.images[0].thumbnailUrl }}
          tint="light"
          uri={item.images[0].url}
        />
        <View style={styles.shadowContainer}>
          <View style={styles.detailsContainer}>
            <View style={styles.titleContainer}>
              <View style={styles.titleFavoriteContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.favoriteContainer}>
                  <TouchableWithoutFeedback onPress={handleFavoritePress}>
                    <FontAwesome
                      name={isFavorite ? "heart" : "heart-o"}
                      size={28}
                      color={isFavorite ? "red" : colors.black}
                      style={styles.heartIcon}
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View style={styles.priceLocationContainer}>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    <MaterialCommunityIcons
                      name="currency-gbp"
                      size={18}
                      color={colors.black}
                    />
                    {item.price}
                  </Text>
                </View>
                {distance && (
                  <View style={styles.locationContainer}>
                    <FontAwesome
                      name="map-marker"
                      size={20}
                      color={colors.black}
                    />
                    <Text style={styles.distance}>{distance} miles away</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          {userDetails && (
            <React.Fragment>
              {console.log("UserDetails:", userDetails.data)}
              {console.log("Profile Image URL:", userDetails.data.profileImage)}

              <CustomAvatar
                imageUri={userDetails.data.profileImage}
                username={userDetails.data.username}
                userListingsCount={userListingsCount}
              />
            </React.Fragment>
          )}
          <View style={styles.shadowContainer}>
            <View style={styles.lookingForHaulersContainer}>
              <TouchableWithoutFeedback onPress={handleLookingForHaulersPress}>
                <View>
                  <Text style={styles.lookingForHaulersText}>
                    Looking for local haulers in your area? Click here!
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View style={styles.shadowContainer}>
            {listingDescription !== "" && (
              <View style={styles.keyDetailsTitleContainer}>
                <Text style={styles.keyDetailsTitle}>
                  Key Details & Description
                </Text>
                <MaterialCommunityIcons
                  name="information"
                  size={24}
                  color={colors.light_orange}
                  style={styles.infoIcon}
                />
                {listingDescription !== "" && (
                  <React.Fragment>
                    <Text
                      numberOfLines={showFullDescription ? undefined : 2}
                      style={styles.description}
                    >
                      {listingDescription}
                    </Text>
                    {!showFullDescription && (
                      <TouchableWithoutFeedback
                        onPress={toggleDescriptionLines}
                      >
                        <Text style={styles.viewMoreLink}>View more</Text>
                      </TouchableWithoutFeedback>
                    )}
                  </React.Fragment>
                )}
              </View>
            )}
          </View>

          <View style={styles.shadowContainer}>
            <View style={styles.youMayAlsoLike}>
              <Text style={styles.youMayAlsoLikeText}>
                You may also like...
              </Text>
              {getListingsApi.loading ? (
                <ActivityIndicator visible={true} />
              ) : (
                <FlatList
                  horizontal
                  data={getListingsApi.data}
                  keyExtractor={(listing) => listing.id.toString()}
                  renderItem={({ item }) => (
                    <CardSuggestions
                      title={item.title}
                      subTitle={"£" + item.price}
                      imageUrl={item.images[0].url}
                      customWidth={150} // Adjust width accordingly
                      onPress={() =>
                        navigation.navigate(routes.LISTING_DETAILS, { item })
                      }
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{ width: 10 }} />} // Adjust the width to add space
                />
              )}
            </View>
          </View>

          <RNGHTouchableWithoutFeedback onPress={() => setFormVisible(true)}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.test,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
  },
  detailsContainer: {
    padding: 15,
    paddingBottom: 0,
    backgroundColor: colors.white,
    borderWidth: 0.6,
    borderColor: colors.test2,
  },
  youMayAlsoLike: {
    marginTop: 20,
    marginBottom: -65,
    padding: 15,
    // paddingBottom: 0,
    backgroundColor: colors.white,
    borderWidth: 0.6,
    borderColor: colors.test2,
    // width: "94%",
    // alignSelf: "center",
  },
  youMayAlsoLikeText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    // height: 100,
    // color: colors.middle_orange,
    // textDecorationLine: "underline",
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
    fontSize: 20,
    fontWeight: "500",
  },
  favoriteContainer: {
    marginLeft: 10,
  },
  priceLocationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    color: colors.black,
    fontSize: 18,
    marginLeft: -2,
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
  heartIcon: {
    marginLeft: 5,
  },
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5.84,
    elevation: 1,
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 5,
    borderWidth: 0.6,
    borderColor: colors.test2,
  },
  avatarContainer: {
    borderColor: colors.test2,
    borderWidth: 2,
    borderRadius: 37.5,
    overflow: "hidden",
    width: 60,
    height: 60,
    marginLeft: 5,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 37.5,
  },
  textContainer: {
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "500",
  },
  userListingsCount: {
    fontSize: 14,
    color: colors.dark,
  },
  lookingForHaulersContainer: {
    backgroundColor: colors.white,
    padding: 10,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 0.6,
    borderColor: colors.test2,
  },
  lookingForHaulersText: {
    fontSize: 16,
    color: colors.middle_orange,
    textDecorationLine: "underline",
  },
  keyDetailsTitleContainer: {
    backgroundColor: colors.white,
    padding: 20,
    marginTop: 20,
    alignSelf: "center",
    width: "94%",
    borderWidth: 0.6,
    borderColor: colors.test2,
  },
  keyDetailsTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  infoIcon: {
    marginLeft: "auto",
    marginRight: 100,
    marginTop: -26,
  },
  description: {
    marginTop: 6,
    fontSize: 14,
  },
  viewMoreLink: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 6,
    textDecorationLine: "underline",
  },
  userContainer: {
    marginVertical: 20,
    height: 50,
  },
  ContactSellerForm: {
    backgroundColor: colors.white,
  },
});

export default ListingDetailsScreen;
