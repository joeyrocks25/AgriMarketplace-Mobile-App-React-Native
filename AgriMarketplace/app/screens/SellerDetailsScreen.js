import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Dimensions, Image } from "react-native";
import ActivityIndicator from "../components/ActivityIndicator";
import CardSellerDetails from "../components/CardSellerDetails";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import Button from "../components/Button";
import useApi from "../hooks/useApi";
import Text from "../components/Text";
const windowWidth = Dimensions.get("window").width;

function SellerDetailsScreen({ route, onScreenFocus }) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const userDetailsData = route.params?.userDetailsData;
  const [refreshKey, setRefreshKey] = useState(0);

  // CustomAvatar function directly included here
  const CustomAvatar = ({ imageUri, username }) => {
    return (
      <View style={styles.avatarContainer}>
        <Image source={{ uri: imageUri }} style={styles.avatar} />
        <Text style={styles.username}>{username}</Text>
      </View>
    );
  };

  const getUserListingsApi = useApi(() =>
    listingsApi.getListings(userDetailsData.id, null)
  );

  useEffect(() => {
    if (isFocused) {
      console.log("SellerDetailsScreen is focused");
      onScreenFocus && onScreenFocus(true);
    } else {
      console.log("SellerDetailsScreen is unfocused");
      onScreenFocus && onScreenFocus(false);
    }
  }, [isFocused, onScreenFocus]);

  useEffect(() => {
    console.log("userDetailsData:", userDetailsData);
    console.log("userDetailsData id:", userDetailsData.id);
  }, [userDetailsData]);

  useEffect(() => {
    getUserListingsApi.request();
  }, [refreshKey]);

  const handleRefreshListings = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <View style={styles.background}>
      <CustomAvatar
        imageUri={userDetailsData.profileImage}
        username={userDetailsData.username}
      />
      <Screen style={styles.screen}>
        {getUserListingsApi.loading ? (
          <ActivityIndicator visible={true} />
        ) : (
          <>
            {/* Render user listings */}
            <FlatList
              style={{ marginTop: 10 }}
              numColumns={1}
              data={getUserListingsApi.data}
              keyExtractor={(listing) => listing.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.listingContainer}>
                  <View style={styles.cardContainer}>
                    <CardSellerDetails
                      title={item.title}
                      subTitle={"£" + item.price}
                      imageUrl={item.images[0].url}
                      customHeight={125}
                      listingId={item.id}
                      onDelete={handleRefreshListings}
                      onPress={() =>
                        navigation.navigate(routes.LISTING_DETAILS, { item })
                      }
                    />
                  </View>
                </View>
              )}
            />

            {getUserListingsApi.error && (
              <View style={styles.errorContainer}>
                <AppText style={styles.errorText}>
                  Couldn't retrieve the listings.
                </AppText>
                <Button
                  title="Retry"
                  onPress={getUserListingsApi.request}
                  style={styles.retryButton}
                />
              </View>
            )}
          </>
        )}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.test, // Set the background color here
  },
  screen: {
    padding: 2,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Adjusted justification
    borderBottomWidth: 1,
    borderBottomColor: colors.test2,
    backgroundColor: colors.middle_orange,
    paddingTop: 10,
    paddingLeft: 10,
    height: "10%",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 5,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  listingContainer: {},
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
  cardContainer: {
    alignItems: "center",
    width: windowWidth - 20,
    alignSelf: "center",
    marginBottom: 10,
  },
});

export default SellerDetailsScreen;
