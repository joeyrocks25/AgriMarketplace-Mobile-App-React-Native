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
import routes from "../navigation/routes"; // Import the routes file

function MessagesScreen(props) {
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logOut } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadConversations = async () => {
    try {
      const response = await messagesApi.getConversations(user.token);

      console.log("r", response.data);

      const conversationsWithLatestMessage = [];

      for (const conversation of response.data) {
        const latestMessage = conversation.lastMessage;
        let listingDetails = null;

        if (latestMessage && latestMessage.listingId) {
          try {
            console.log("listing id issss ", latestMessage.listingId);
            const listingResponse = await listingsApi.getListingById(
              latestMessage.listingId
            );
            listingDetails = listingResponse.data;
            console.log("Retrieved Listing Details:", listingDetails); // Log listing details
          } catch (error) {
            console.log("Error retrieving listing:", error);
          }
        }

        conversationsWithLatestMessage.push({
          ...conversation,
          lastMessage: {
            ...latestMessage,
            listingDetails, // Include the retrieved listing details
          },
        });
      }

      console.log("l", conversationsWithLatestMessage);
      setConversations(conversationsWithLatestMessage);
    } catch (error) {
      console.log("Error loading conversations:", error);
    }
  };

  // const handleDelete = (conversation) => {
  //   // Delete the conversation from conversations
  //   setConversations(conversations.filter((c) => c.uuid !== conversation.uuid));
  // };

  const handleConversationPress = (conversation) => {
    // Log the details of the selected conversation
    console.log("Selected Conversation:", conversation);

    // const conversationId = conversation.lastMessage.conversationId;
    console.log(conversation);
    // console.log("Selected Conversation:", item.lastMessage.conversationId);

    // Navigate to the MessagesConversation screen
    navigation.navigate(routes.MESSAGES_CONVERSATION, { conversation });
  };

  return (
    <Screen>
      <FlatList
        data={conversations}
        keyExtractor={(conversation) => conversation.uuid}
        renderItem={({ item }) => {
          console.log("Conversation Item:", item); // Log the item
          console.log("Listing ID:", item.lastMessage.listingId); // Log the listingId
          return (
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
          );
        }}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={loadConversations}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
