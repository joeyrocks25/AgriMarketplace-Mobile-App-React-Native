import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import CardBin from "../components/CardBin";
import colors from "../config/colors";
import favouritesApi from "../api/favourites";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";

// User Favourites Screen component
function UserFavouritesScreen({ navigation }) {
  // Get authenticated user
  const { user } = useAuth();

  // State to trigger refresh of favourites
  const [refreshKey, setRefreshKey] = useState(0);

  // API hook to fetch user favourites
  const getFavouritesApi = useApi(() =>
    favouritesApi.getFavourites(user.userId)
  );

  // Fetch user favourites on component mount and refreshKey change
  useEffect(() => {
    getFavouritesApi.request();
  }, [refreshKey]);

  // Handler to delete favourite
  const handleDeleteFavourite = async (favouriteId) => {
    try {
      await favouritesApi.deleteFavourite(favouriteId);
      console.log("Favourite deleted successfully!");
      setRefreshKey((prevKey) => prevKey + 1); // Refresh the favourites data
    } catch (error) {
      console.error("Error deleting favourite:", error);
    }
  };

  return (
    <Screen style={styles.screen}>
      {/* Show loading indicator while fetching favourites */}
      {getFavouritesApi.loading ? (
        <ActivityIndicator visible={true} />
      ) : (
        <>
          {/* FlatList to render user favourites */}
          <FlatList
            numColumns={2}
            data={getFavouritesApi.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listingContainer}>
                <CardBin
                  title={item.title}
                  subTitle={"£" + item.price}
                  subTitleStyle={styles.price}
                  imageUrl={item.images[0].url}
                  customHeight={200}
                  onPress={() =>
                    navigation.navigate(routes.LISTING_DETAILS, item)
                  }
                  iconName="heart" // Specify the icon to display
                  favouriteId={item.id}
                  setRefreshKey={setRefreshKey}
                />
              </View>
            )}
          />

          {/* Show error message and retry button if fetching favourites fails */}
          {getFavouritesApi.error && (
            <View style={styles.errorContainer}>
              <AppText style={styles.errorText}>
                Couldn't retrieve the favourites.
              </AppText>
              <Button
                title="Retry"
                onPress={getFavouritesApi.request}
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
  price: {
    color: colors.dark_green,
  },
});

export default UserFavouritesScreen;
