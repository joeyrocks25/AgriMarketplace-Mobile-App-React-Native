import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Keyboard,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import listingsApi from "../api/listings";
import Card from "../components/Card";
import DistanceCalculator from "../components/DistanceCalculator";
import useLocation from "../hooks/useLocation";
import { useFocusEffect } from "@react-navigation/native";
import routes from "../navigation/routes";

function SearchBarScreen({ navigation }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const inputRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [])
  );

  const handleCancel = () => {
    setSearchText("");
    Keyboard.dismiss();
    setSearchResults([]);
  };

  const handleSearch = async () => {
    try {
      console.log("Searching for:", searchText);
      const response = await listingsApi.getListingsBySearch(searchText);

      console.log("Search 1:", response);

      if (Array.isArray(response) && response.length > 0) {
        console.log("Search results:", response);
        setSearchResults(response);
      } else {
        console.log("No search results found.");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleSubmit = () => {
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search for anything"
          placeholderTextColor="#888"
          onChangeText={(text) => setSearchText(text)}
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => setIsSearchActive(false)}
          value={searchText}
          onSubmitEditing={handleSubmit} // Handle form submission
        />
        {isSearchActive && (
          <TouchableOpacity onPress={handleCancel}>
            <FontAwesome name="times-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.cardContainer}>
        {searchResults && searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(result) => result.id.toString()}
            renderItem={({ item }) => (
              <Card
                title={item.title}
                subTitle={`£${item.price}`}
                imageUrl={item.images[0].url}
                customHeight={200}
                onPress={() => {
                  console.log("Pressed:", item.title);
                  navigation.navigate(routes.LISTING_DETAILS, {
                    item,
                    origin: "search",
                  });
                }}
                distance={
                  location &&
                  item.location && (
                    <DistanceCalculator
                      location1={item.location}
                      location2={location}
                    />
                  )
                }
              />
            )}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <FontAwesome name="search" size={60} color="#888" />
            <Text style={styles.emptyStateText}>
              No results found. {"\n"}Start a new search or explore our content.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 20,
  },
  searchBar: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
    marginBottom: 5,
  },
  input: {
    fontSize: 18,
    color: "#333",
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    padding: Platform.OS === "android" ? 20 : 0,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
});

export default SearchBarScreen;
