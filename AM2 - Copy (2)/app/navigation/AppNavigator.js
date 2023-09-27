import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import CategorySelectScreen from "../screens/CategorySelectScreen";
import FeedNavigator from "./FeedNavigator";
import ListingEditScreen from "../screens/ListingEditScreen";
import MessagesScreen from "../screens/MessagesScreen";
import SearchBarScreen from "../screens/SearchBarScreen";
import AccountNavigator from "./AccountNavigator";
import NewListingButton from "./NewListingButton";
import routes from "./routes";
import useNotifications from "../hooks/useNotifications";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CategoryListingsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={CategorySelectScreen}
      options={{
        headerShown: false,
        // ...options for CategorySelectScreen...
      }}
    />
    <Stack.Screen
      name="Feed"
      component={FeedNavigator} // Use FeedNavigator as the component
      options={{
        headerShown: false,
        // title: "Listings", // Set a custom title for the Feed screen
        // ...other options specific to the Feed screen...
      }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  useNotifications();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={CategoryListingsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchBarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ListingEdit"
        component={ListingEditScreen}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton
              onPress={() => navigation.navigate(routes.LISTING_EDIT)}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={size}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="message-text-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
