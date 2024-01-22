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

function UserListingsScreen({ navigation }) {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const getUserListingsApi = useApi(() =>
    listingsApi.getListings(user.userId, null)
  );

  useEffect(() => {
    getUserListingsApi.request();
  }, [refreshKey]);

  const handleRefreshListings = () => {
    // Increment the key to trigger a refresh
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Screen style={styles.screen}>
      {getUserListingsApi.loading ? (
        <ActivityIndicator visible={true} />
      ) : (
        <>
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
                  onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
                />
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
