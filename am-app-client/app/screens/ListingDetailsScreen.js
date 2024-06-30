import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Image as RNImage,
  KeyboardAvoidingView,
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
import { Platform } from "react-native";

function CustomAvatar({ imageUri, username, userListingsCount, onPress }) {
  const listingsText = userListingsCount === 1 ? "Listing" : "Listings";

  return (
    <TouchableWithoutFeedback onPress={onPress}>
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
          <FontAwesome
            name="angle-right"
            size={24}
            color={colors.dark}
            style={styles.arrowIcon}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Main component for the listing details screen
function ListingDetailsScreen({ route, onScreenFocus }) {
  const scrollViewRef = useRef();
  const { item, origin } = route.params;
  const categoryId = route.params?.item?.categoryId;
  const userId = item ? item.userId : null;

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const location = useLocation();
  const { user } = useAuth();
  let userLocation = null;

  if (location) {
    userLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  }

  const sellerLocation =
    item && item.location
      ? {
          latitude: item.location.latitude,
          longitude: item.location.longitude,
        }
      : null;

  const distance =
    userLocation && sellerLocation ? (
      <DistanceCalculator location1={sellerLocation} location2={userLocation} />
    ) : null;

  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // Function to handle adding item to favorites
  const handleFavoritePress = async () => {
    try {
      if (isFavorite) {
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

      setIsFavorite(true);
      setLoadingFavorite(false);
    } catch (error) {
      console.error("Error:", error);
      setLoadingFavorite(false);
    }
  };

  // Function to handle press event for looking for haulers
  const handleLookingForHaulersPress = () => {
    navigation.navigate(routes.HAULERS_SCREEN, {
      onScreenFocus: onScreenFocus,
    });
  };

  const [userListingsCount, setUserListingsCount] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [listingDescription, setListingDescription] = useState("");

  const getListingsApi = useApi(() =>
    listingsApi.getListings(null, categoryId)
  );

  useEffect(() => {
    getListingsApi.request();
  }, [categoryId]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        if (!userId) return;

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
        if (!userId) return;

        const response = await usersApi.getUser(userId);
        setUserDetails(response);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchListings();
    fetchUser();
  }, [userId, isFocused, categoryId]);

  // Function to toggle full description view
  const [formVisible, setFormVisible] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescriptionLines = () => {
    setShowFullDescription((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.select({
        ios: 100,
        android: -550,
      })}
      style={{ flex: 1 }}
    >
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
                  <TouchableWithoutFeedback
                    onPress={handleFavoritePress}
                    testID="favorite-button"
                  >
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
              <CustomAvatar
                imageUri={userDetails.profileImage}
                username={userDetails.username}
                userListingsCount={userListingsCount}
                onPress={() => {
                  navigation.navigate(routes.SELLER_DETAILS, {
                    userDetailsData: userDetails,
                  });
                }}
              />
            </React.Fragment>
          )}
          <View style={styles.shadowContainer}>
            <View style={styles.lookingForHaulersContainer}>
              <TouchableWithoutFeedback
                onPress={handleLookingForHaulersPress}
                testID="looking-for-haulers-link"
              >
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
                      numberOfLines={showFullDescription ? undefined : 1}
                      style={styles.description}
                      testID="description-text"
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
                      customWidth={150}
                      onPress={() =>
                        navigation.navigate(routes.LISTING_DETAILS, { item })
                      }
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
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
        <ContactSellerForm listing={item} visible={formVisible} />
      </View>
    </KeyboardAvoidingView>
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
    borderColor: colors.grey_border,
  },
  youMayAlsoLike: {
    marginTop: 20,
    marginBottom: -65,
    padding: 15,
    backgroundColor: colors.white,
    borderWidth: 0.6,
    borderColor: colors.grey_border,
  },
  youMayAlsoLikeText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
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
    borderColor: colors.grey_border,
  },
  avatarContainer: {
    borderColor: colors.grey_border,
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
    borderColor: colors.grey_border,
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
    borderColor: colors.grey_border,
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
    marginBottom: -10,
  },
  arrowIcon: {
    marginLeft: "auto",
    marginRight: 10,
  },
});

export default ListingDetailsScreen;
