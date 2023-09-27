import React, { useEffect } from "react";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";

function UserFavouritesScreen({ navigation }) {
  const { user } = useAuth();

  const getFavouritesApi = useApi(() =>
    favouritesApi.getFavourites(user.userId)
  );

  useEffect(() => {
    getFavouritesApi.request();
  }, []);

  console.log("Favourites:", getFavouritesApi.data); // Log the favourites data

  return (
    <Screen style={styles.screen}>
      {getFavouritesApi.loading ? (
        <ActivityIndicator visible={true} />
      ) : (
        <>
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
                  customHeight={200} // Adjust the height based on your requirements
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate(routes.LISTING_DETAILS, item)
                  }
                />
              </View>
            )}
          />

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
  card: {
    height: 125,
  },
});

export default UserFavouritesScreen;
