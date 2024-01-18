import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Button,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import messagesApi from "../api/messages";
import useAuth from "../auth/useAuth";

function MessagesConversation() {
  const route = useRoute();
  const { conversation } = route.params;
  const conversationId = conversation.lastMessage.conversationId;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadMessages();
  }, []);

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

      console.log("ok", response.data);
      console.log("user", user.userId);

      // Reverse the order of messages before setting in the state
      setMessages(response.data.reverse());
    } catch (error) {
      console.log("Error loading messages:", error);
    }
  };

  const handleSendReply = async () => {
    try {
      if (!newMessage.trim()) {
        // Don't send an empty message
        return;
      }

      // Send the new reply message to the server using sendReplyToConversation
      try {
        await messagesApi.sendReplyToConversation(
          user.token,
          conversationId,
          newMessage,
          conversation.lastMessage.listingId
        );

        console.log("test");

        // Clear the input field
        setNewMessage("");

        // Refresh messages by calling loadMessages again
        loadMessages();
      } catch (error) {
        console.log("Error sending reply:", error);
      }
    } catch (error) {
      console.log("Error sending reply:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.select({ ios: 80, android: -500 })}
    >
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.fromUserId === user.userId
                ? styles.receivedMessageContainer // Swap sent and received styles for the current user
                : styles.sentMessageContainer,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                item.fromUserId === user.userId
                  ? styles.receivedBubble // Swap sent and received styles for the current user
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
    padding: 16,
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
    alignSelf: "flex-start", // Align sent messages to the left
    backgroundColor: "#DCF8C6",
  },
  receivedBubble: {
    alignSelf: "flex-end", // Align received messages to the right
    backgroundColor: "#F3F3F3",
  },
});

export default MessagesConversation;
