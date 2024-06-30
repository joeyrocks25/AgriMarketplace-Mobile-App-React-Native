import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ActivityIndicator from "../components/ActivityIndicator";
import CardBin from "../components/CardBin";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import Button from "../components/Button";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";

// User Listings Screen component
function UserListingsScreen({ navigation }) {
  // Get authenticated user
  const { user } = useAuth();

  // State to trigger refresh of listings
  const [refreshKey, setRefreshKey] = useState(0);

  // API hook to fetch user listings
  const getUserListingsApi = useApi(() =>
    listingsApi.getListings(user.userId, null)
  );

  // Fetch user listings on component mount and refreshKey change
  useEffect(() => {
    getUserListingsApi.request();
  }, [refreshKey]);

  // Handler to refresh user listings
  const handleRefreshListings = () => {
    // Increment the key to trigger a refresh
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Screen style={styles.screen}>
      {/* Show loading indicator while fetching listings */}
      {getUserListingsApi.loading ? (
        <ActivityIndicator visible={true} />
      ) : (
        <>
          {/* FlatList to render user listings */}
          <FlatList
            numColumns={2}
            data={getUserListingsApi.data}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listingContainer}>
                <CardBin
                  title={item.title}
                  subTitle={"£" + item.price}
                  imageUrl={item.images[0].url}
                  customHeight={125}
                  listingId={item.id}
                  onDelete={handleRefreshListings}
                  onPress={() =>
                    navigation.navigate(routes.LISTING_DETAILS, item)
                  }
                  iconName="delete" // Specify the icon to display
                  setRefreshKey={setRefreshKey}
                />
              </View>
            )}
          />

          {/* Show error message and retry button if fetching listings fails */}
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
  );
}

const styles = StyleSheet.create({
  listingContainer: {
    width: "50%",
    paddingHorizontal: 5,
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
});

export default UserListingsScreen;
