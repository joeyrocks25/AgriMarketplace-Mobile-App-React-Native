import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import UserListingsScreen from "../screens/UserListingsScreen";
import UserProfile from "../screens/UserProfile";
import UserFavouritesScreen from "../screens/UserFavouritesScreen";
import MessagesConversation from "../screens/MessagesConversation";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen name="My Listings" component={UserListingsScreen} />
    <Stack.Screen name="My Profile" component={UserProfile} />
    <Stack.Screen name="Saved Listings" component={UserFavouritesScreen} />
    <Stack.Screen name="Conversation" component={MessagesConversation} />
  </Stack.Navigator>
);

export default AccountNavigator;
