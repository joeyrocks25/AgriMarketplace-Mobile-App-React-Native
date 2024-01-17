import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import { useNavigation, useNavigationState } from "@react-navigation/native";

const Stack = createStackNavigator();

const FeedNavigator = () => {
  const navigation = useNavigation();
  const route = useNavigationState(state => state);

  useEffect(() => {
    // console.log("FeedNavigator - route index:", route.index);
  }, [route]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Listings" component={ListingsScreen} />
      <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
    </Stack.Navigator>
  );
};

export default FeedNavigator;
