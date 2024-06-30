import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Button,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import messagesApi from "../api/messages";
import usersApi from "../api/users";
import useAuth from "../auth/useAuth";
import CustomAvatar from "../components/CustomAvatar";
import { useNavigation } from "@react-navigation/native";

function MessagesConversation() {
  const route = useRoute(); // Get the route object
  const { conversation } = route.params; // Extract conversation from route params
  const conversationId = conversation.lastMessage.conversationId; // Get conversation ID
  const [newMessage, setNewMessage] = useState(""); // State for new message input
  const [messages, setMessages] = useState([]); // State for messages
  const [otherUserID, setOtherUserID] = useState(null); // State for other user ID
  const [otherUser, setOtherUser] = useState(null); // State for other user details
  const { user } = useAuth(); // Get user object from useAuth hook
  const navigation = useNavigation(); // Get navigation object

  // Load messages and other user details when component mounts or otherUserID changes
  useEffect(() => {
    loadMessages();

    const fetchUser = async () => {
      try {
        if (otherUserID) {
          const response = await usersApi.getUser(otherUserID);
          setOtherUser(response.data); // Set otherUser state with fetched user details
          navigation.setParams(response.data); // Set navigation params with other user details
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [otherUserID]);

  // Function to load messages
  const loadMessages = async () => {
    try {
      if (!conversationId) {
        console.log("Conversation ID is not available yet.");
        return;
      }

      const response = await messagesApi.getMessagesForConversation(
        user.token,
        conversationId
      );

      const currentUserID = user.userId;

      // Determine the other user's ID
      for (const message of response.data) {
        if (message.fromUserId !== currentUserID) {
          setOtherUserID(message.fromUserId);
          break;
        }

        if (message.toUserId !== currentUserID) {
          setOtherUserID(message.toUserId);
          break;
        }
      }

      setMessages(response.data.reverse()); // Set messages state with fetched messages
    } catch (error) {
      console.log("Error loading messages:", error);
    }
  };

  // Function to handle sending a reply message
  const handleSendReply = async () => {
    try {
      if (!newMessage.trim()) {
        return;
      }

      // Send the new reply message to the server
      await messagesApi.sendReplyToConversation(
        user.token,
        conversationId,
        newMessage,
        conversation.lastMessage.listingId
      );

      setNewMessage(""); // Clear the new message input

      // Refresh messages by loading them again
      loadMessages();
    } catch (error) {
      console.log("Error sending reply:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.select({
        ios: 110,
        android: -500,
      })}
    >
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              {
                paddingHorizontal: 10,
              },
              item.fromUserId === user.userId
                ? styles.receivedMessageContainer
                : styles.sentMessageContainer,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                item.fromUserId === user.userId
                  ? styles.receivedBubble
                  : styles.sentBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          </View>
        )}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={handleSendReply} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 8,
    marginTop: 5,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 8,
    borderRadius: 10,
    marginVertical: 4,
  },
  messageText: {
    fontSize: 16,
  },
  sentBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#DCF8C6",
  },
  receivedBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#F3F3F3",
  },
});

export default MessagesConversation;
