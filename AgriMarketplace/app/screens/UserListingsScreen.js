import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import CardBin from "../components/CardBin";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";

function ListingsScreen({ navigation }) {
  const { user } = useAuth();

  // need to fix this
  const getListingsApi = useApi(() =>
    listingsApi.getListings(user.userId, null)
  );

  // const getListingsApi = useApi(listingsApi.getListings());

  useEffect(() => {
    getListingsApi.request();
  }, []);

  return (
    <Screen style={styles.screen}>
      {getListingsApi.loading ? (
        <ActivityIndicator visible={true} />
      ) : (
        <>
          <FlatList
            numColumns={2}
            data={getListingsApi.data}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listingContainer}>
                <CardBin
                  title={item.title}
                  subTitle={"£" + item.price}
                  subTitleStyle={styles.price}
                  imageUrl={item.images[0].url}
                  customHeight={125}
                  style={styles.card} // Add this line
                  onPress={() =>
                    navigation.navigate(routes.LISTING_DETAILS, item)
                  }
                />
              </View>
            )}
          />

          {getListingsApi.error && (
            <View style={styles.errorContainer}>
              <AppText style={styles.errorText}>
                Couldn't retrieve the listings.
              </AppText>
              <Button
                title="Retry"
                onPress={getListingsApi.request}
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
  listContainer: {
    flex: 1,
    flexDirection: "row",
  },
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

export default ListingsScreen;
