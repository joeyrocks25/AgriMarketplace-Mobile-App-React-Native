import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";

function HaulersScreen({ navigation, onScreenFocus }) {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("ListingDetailsScreen is focused1");
      onScreenFocus && onScreenFocus(true);
    } else {
      console.log("ListingDetailsScreen is unfocused1");
      onScreenFocus && onScreenFocus(false);
    }
  }, [isFocused, onScreenFocus]);

  return (
    <View>
      <Text>This is the haulers Screen. Replace this with your content.</Text>
    </View>
  );
}

export default HaulersScreen;
