import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";

const countiesData = [
  { id: 1, name: "Antrim" },
  { id: 2, name: "Down" },
  { id: 3, name: "Armagh" },
  { id: 4, name: "Derry" },
  { id: 5, name: "Tyrone" },
  { id: 6, name: "Fermanagh" },
];

const haulersData = [
  { id: 1, name: "Hauler 1", county: "Antrim" },
  { id: 2, name: "Hauler 2", county: "Down" },
  { id: 3, name: "Hauler 3", county: "Armagh" },
  { id: 4, name: "Hauler 4", county: "Derry" },
  { id: 5, name: "Hauler 5", county: "Tyrone" },
  { id: 6, name: "Hauler 6", county: "Fermanagh" },
  // Add more haulers as needed
];

function HaulersScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const [selectedCounty, setSelectedCounty] = useState(null);
  const filteredHaulers = haulersData.filter(
    (hauler) => !selectedCounty || hauler.county === selectedCounty
  );

  useEffect(() => {
    if (isFocused) {
      console.log("HaulersScreen is focused");
      route.params &&
        route.params.onScreenFocus &&
        route.params.onScreenFocus(true);
    } else {
      console.log("HaulersScreen is unfocused");
      route.params &&
        route.params.onScreenFocus &&
        route.params.onScreenFocus(false);
    }
  }, [isFocused, route.params]);

  const handleCountySelect = (county) => {
    setSelectedCounty(county);
  };

  return (
    <View>
      <Text>To view haulers in your area. Please Select a county:</Text>
      <Picker
        selectedValue={selectedCounty}
        onValueChange={(itemValue) => handleCountySelect(itemValue)}
      >
        <Picker.Item label="All Counties" value={null} />
        {countiesData.map((county) => (
          <Picker.Item
            key={county.id}
            label={county.name}
            value={county.name}
          />
        ))}
      </Picker>

      <Text>Haulers in {selectedCounty || "all counties"}:</Text>
      <FlatList
        data={filteredHaulers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            {/* Add more hauler details as needed */}
          </View>
        )}
      />
    </View>
  );
}

export default HaulersScreen;
