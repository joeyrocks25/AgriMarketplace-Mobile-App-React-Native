import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { useIsFocused } from "@react-navigation/native";

const countiesData = [
  "All Counties",
  "Antrim",
  "Down",
  "Armagh",
  "Derry",
  "Tyrone",
  "Fermanagh",
];

const haulersData = [
  {
    id: 1,
    name: "Livestock Express",
    county: "Antrim",
    rating: 4.8,
    services: ["Livestock Transportation", "Temperature-Controlled"],
    contactNumber: "+44 7712 345678",
    emailAddress: "livestock@expresshaulage.com",
  },
  {
    id: 2,
    name: "Machinery Movers Ltd",
    county: "Down",
    rating: 4.2,
    services: ["Heavy Machinery Transport", "Warehousing"],
    contactNumber: "+44 7890 123456",
    emailAddress: "info@machinerymovers.com",
  },
  {
    id: 3,
    name: "AgriTrans Solutions",
    county: "Armagh",
    rating: 4.5,
    services: [
      "Agricultural Equipment Hauling",
      "Last-Mile Delivery",
      "Storage Solutions",
    ],
    contactNumber: "+44 7712 987654",
    emailAddress: "info@agritrans.co.uk",
  },
  {
    id: 4,
    name: "Caravan Carriers",
    county: "Derry",
    rating: 4.0,
    services: ["Caravan Transport", "Express Delivery"],
    contactNumber: "+44 7123 456789",
    emailAddress: "caravans@carriersonline.com",
  },
  {
    id: 5,
    name: "Toolbox Transits",
    county: "Tyrone",
    rating: 4.7,
    services: ["Tools and Equipment Hauling", "Express Delivery"],
    contactNumber: "+44 7890 987654",
    emailAddress: "info@toolboxtransits.co.uk",
  },
  {
    id: 6,
    name: "Fermanagh Freight Solutions",
    county: "Fermanagh",
    rating: 4.3,
    services: ["General Cargo", "Freight Forwarding", "Temperature-Controlled"],
    contactNumber: "+44 7712 345678",
    emailAddress: "info@fermanaghfreight.com",
  },
  // Add more haulers as needed
];
const HaulerHUD = ({ name, rating, services, contactNumber, emailAddress }) => (
  <TouchableOpacity
    style={styles.haulerHUDContainer}
    onPress={() => {
      Linking.openURL(`tel:${contactNumber}`);
    }}
  >
    <Text style={styles.haulerName}>{name}</Text>
    <Text style={styles.haulerRating}>Rating: {rating}</Text>
    <Text style={styles.haulerServices}>Services: {services.join(", ")}</Text>
    <Text style={styles.contactText}>Contact: {contactNumber}</Text>
    <Text style={styles.contactText}>Email: {emailAddress}</Text>
  </TouchableOpacity>
);

const HaulerScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [selectedCounty, setSelectedCounty] = useState(null);

  useEffect(() => {
    if (isFocused) {
      console.log("RegisterScreen is focused");
      route.params &&
        route.params.onScreenFocus &&
        route.params.onScreenFocus(true);
    } else {
      console.log("RegisterScreen is unfocused");
      route.params &&
        route.params.onScreenFocus &&
        route.params.onScreenFocus(false);
    }
  }, [isFocused, route.params]);

  const handleCountySelect = (index, value) => {
    setSelectedCounty(value === "All Counties" ? null : value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        To view haulers in your area, please select a county:
      </Text>
      <ModalDropdown
        options={countiesData}
        defaultValue="All Counties"
        onSelect={handleCountySelect}
        textStyle={styles.dropdownText}
        style={styles.dropdownContainer}
        dropdownStyle={styles.dropdownList}
      />

      <Text style={styles.subHeaderText}>
        Haulers in {selectedCounty || "all counties"}:
      </Text>
      <FlatList
        data={haulersData.filter(
          (hauler) => !selectedCounty || hauler.county === selectedCounty
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HaulerHUD
            name={item.name}
            rating={item.rating}
            services={item.services}
            contactNumber={item.contactNumber}
            emailAddress={item.emailAddress}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
  },
  dropdownContainer: {
    width: 300,
    marginTop: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    position: "relative",
  },

  dropdownList: {
    width: 300, // Adjust the width as needed
    position: "absolute",
    top: "100%", // Position it just below the dropdown container
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginLeft: -11,
  },
  dropdownText: {
    fontSize: 16,
    color: "black",
  },
  subHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
  },
  haulerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  haulerText: {
    fontSize: 16,
    color: "black",
  },

  haulerHUDContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  haulerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  haulerRating: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  haulerServices: {
    fontSize: 16,
    color: "#555",
  },
  contactText: {
    fontSize: 14,
    color: "#555",
  },
});

export default HaulerScreen;
