import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import useAuth from "../auth/useAuth";
import messagesApi from "../api/messages";
import listingsApi from "../api/listings";
import usersApi from "../api/users";
import routes from "../navigation/routes";

function MessagesScreen(props) {
  const [conversations, setConversations] = useState([]); // State to store conversations
  const [refreshing, setRefreshing] = useState(false); // State to indicate refreshing
  const { user, logOut } = useAuth(); // Get user and logout function from useAuth hook
  const navigation = useNavigation(); // Get navigation object

  // Load conversations when component mounts or dependencies change
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Function to load conversations
  const loadConversations = async () => {
    try {
      // Fetch conversations from API
      const response = await messagesApi.getConversations(user.token);
      const conversationsWithLatestMessage = [];

      // Process each conversation to include latest message and listing details
      for (const conversation of response.data) {
        const latestMessage = conversation.lastMessage;
        let listingDetails = null;

        // Fetch listing details if available
        if (latestMessage && latestMessage.listingId) {
          try {
            const listingResponse = await listingsApi.getListingById(
              latestMessage.listingId
            );
            listingDetails = listingResponse.data;
          } catch (error) {
            console.log("Error retrieving listing:", error);
          }
        }

        // Include listing details in the conversation
        conversationsWithLatestMessage.push({
          ...conversation,
          lastMessage: {
            ...latestMessage,
            listingDetails,
          },
        });
      }

      // Set conversations state with updated data
      setConversations(conversationsWithLatestMessage);
    } catch (error) {
      console.log("Error loading conversations:", error);
    }
  };

  // Function to handle conversation press
  const handleConversationPress = async (conversation) => {
    try {
      const currentUserID = user.userId;
      let otherUserID = null;

      // Determine the other user's ID
      if (
        conversation &&
        conversation.lastMessage &&
        conversation.lastMessage.conversationId
      ) {
        const lastMessage = conversation.lastMessage;

        if (lastMessage.fromUserId !== currentUserID) {
          otherUserID = lastMessage.fromUserId;
        } else if (lastMessage.toUserId !== currentUserID) {
          otherUserID = lastMessage.toUserId;
        }
      }

      // Fetch other user details based on otherUserID
      if (otherUserID) {
        const response = await usersApi.getUser(otherUserID);

        // Navigate to the conversation screen with both conversation and otherUser details
        navigation.navigate(routes.MESSAGES_CONVERSATION, {
          conversation,
          response,
        });
      } else {
        console.log("otherUserID is not available");
      }
    } catch (error) {
      console.log("Error handling conversation press:", error);
    }
  };

  return (
    <Screen>
      {/* FlatList to display conversations */}
      <FlatList
        data={conversations}
        keyExtractor={(conversation) => conversation.uuid}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subTitle={item.lastMessage ? item.lastMessage.content : ""}
            image={
              item.lastMessage && item.lastMessage.listingDetails
                ? { uri: item.lastMessage.listingDetails.images[0].url }
                : require("../assets/profile_photo.png")
            }
            onPress={() => handleConversationPress(item)}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={loadConversations}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
