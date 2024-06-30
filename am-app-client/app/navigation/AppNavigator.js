import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, View, Platform } from "react-native"; // Import TouchableOpacity
import CategorySelectScreen from "../screens/CategorySelectScreen";
import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import ListingEditScreen from "../screens/ListingEditScreen";
import SellerDetailsScreen from "../screens/SellerDetailsScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MessagesConversation from "../screens/MessagesConversation";
import HaulersScreen from "../screens/HaulersScreen";
import SearchBarScreen from "../screens/SearchBarScreen";
import AccountNavigator from "./AccountNavigator";
import NewListingButton from "./NewListingButton";
import routes from "./routes";
import useNotifications from "../hooks/useNotifications";
import CustomAvatar from "../components/CustomAvatar";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = ({ setShowTabBar }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Category"
      component={CategorySelectScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Listings"
      component={ListingsScreen}
      options={({ navigation }) => ({
        title: "Category Selector",
        headerShown: true,
        headerBackTitle: "Back", // Customize the back button text
        headerBackTitleVisible: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={28}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: "white", // Customize the header background color
        },
      })}
    />
    <Stack.Screen
      name="ListingDetails"
      component={ListingDetailsScreen}
      options={({ navigation }) => ({
        title: "View Listings",
        headerShown: true,
        headerBackTitle: "Back", // Customize the back button text
        headerBackTitleVisible: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={28}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: "white", // Customize the header background color
        },
      })}
    />
    <Stack.Screen
      name="Seller Details"
      component={SellerDetailsScreen}
      options={({ navigation }) => ({
        title: "Seller Details",
        headerShown: true,
        headerBackTitle: "Back", // Customize the back button text
        headerBackTitleVisible: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: "white", // Customize the header background color
        },
      })}
    />
    <Stack.Screen
      name="Haulers"
      component={HaulersScreen}
      options={({ navigation }) => ({
        title: "View Listing",
        headerShown: true,
        headerBackTitle: "Back", // Customize the back button text
        headerBackTitleVisible: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: "white",
        },
      })}
    />
  </Stack.Navigator>
);

const MessagesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Messages"
      component={MessagesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.MESSAGES_CONVERSATION}
      component={MessagesConversation}
      // Inside the options of MessagesStack
      // Inside the options of MessagesStack
      // Inside the options of MessagesStack
      options={({ navigation, route }) => {
        const { otherUser } = route;
        console.log("profile image is", route.params.profileImage);
        console.log("username is", route.params.name);

        return {
          title: "", // Set an empty title
          headerShown: true,
          headerBackTitle: "Back", // Customize the back button text
          headerBackTitleVisible: true,
          headerTitleAlign: "center", // Align the header title to center

          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
                justifyContent: "flex-start",
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              {/* Wrap the custom avatar in another view */}
              <View style={{ marginLeft: 10 }}>
                {/* Render the custom avatar here */}
                {route && (
                  <CustomAvatar
                    imageUri={route.params.profileImage}
                    name={route.params.name}
                    size={40} // Adjust the size as needed
                    style={{ marginLeft: 10 }}
                  />
                )}
              </View>
            </View>
          ),

          headerStyle: {
            backgroundColor: "orange", // Customize the header background color
            height: Platform.OS === "android" ? 60 : 110,
          },
        };
      }}
    />
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
    <Tab.Navigator
      initialRouteName="home"
      tabBarOptions={{ showLabel: false }}
      tabBar={showTabBar ? undefined : () => null}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
          tabBarLabel: "Feed",
          headerShown: false, // Hide header for the "Home" screen
        }}
      >
        {() => <HomeStack setShowTabBar={setShowTabBar} />}
      </Tab.Screen>

      <Tab.Screen
        name="Search for Listings"
        component={SearchBarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" color={color} size={size} />
          ),
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
          tabBarLabel: "Search",
        }}
      />

      <Tab.Screen
        name="Post a Listing"
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
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
        })}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="message-text-outline"
              color={color}
              size={size}
            />
          ),
          tabBarShowLabel: true,
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
          tabBarLabel: "Messages",
          headerShown: false,
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
              display: "flex",
            },
            null,
          ],
          tabBarLabel: "Account",
          headerShown: false, // Hide header for the "Home" screen
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
