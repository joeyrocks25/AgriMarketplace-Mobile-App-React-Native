import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import CategorySelectScreen from "../screens/CategorySelectScreen";
import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import ListingEditScreen from "../screens/ListingEditScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MessagesConversation from "../screens/MessagesConversation"; // Import the MessagesConversation component
import SearchBarScreen from "../screens/SearchBarScreen";
import AccountNavigator from "./AccountNavigator";
import NewListingButton from "./NewListingButton";
import routes from "./routes";
import useNotifications from "../hooks/useNotifications";
import { useIsFocused } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = ({ setShowTabBar }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Category" component={CategorySelectScreen} />
    <Stack.Screen name="Listings" component={ListingsScreen} />
    <Stack.Screen name="ListingDetails">
      {(props) => (
        <ListingDetailsScreen
          {...props}
          onScreenFocus={(isFocused) => setShowTabBar(!isFocused)}
          isFocused={props.navigation.isFocused()}
        />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

const MessagesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen name={routes.MESSAGES_CONVERSATION} component={MessagesConversation} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  useNotifications();
  const [showTabBar, setShowTabBar] = useState(true);

  useEffect(() => {
    // Add logic to determine when to hide the tab bar
    setShowTabBar(true); // Adjust the condition accordingly
  }, []); // Run this effect once when the component mounts

  return (
    <Tab.Navigator initialRouteName="home" tabBarOptions={{ showLabel: false }} tabBar={showTabBar ? undefined : () => null}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
          tabBarLabel: 'Feed',
          headerShown: false, // Hide header for the "Home" screen
        }}
      >
        {() => <HomeStack setShowTabBar={setShowTabBar} />}
      </Tab.Screen>

      <Tab.Screen
        name="Search"
        component={SearchBarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" color={color} size={size} />
          ),
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
          tabBarLabel: 'Search',
        }}
      />
    
      <Tab.Screen
        name="ListingEdit"
        component={ListingEditScreen}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton onPress={() => navigation.navigate(routes.LISTING_EDIT)} />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" color={color} size={size} />
          ),
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
        })}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStack} // Use the MessagesStack component
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-text-outline" color={color} size={size} />
          ),
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
          tabBarLabel: 'Messages',
        }}
      />
  
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
          tabBarLabel: 'Account',
          headerShown: false, // Hide header for the "Home" screen
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
