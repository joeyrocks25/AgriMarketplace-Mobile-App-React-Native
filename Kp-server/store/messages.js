// messages.js
const usersStore = require("../store/users");
const { v4: uuidv4 } = require("uuid");

const messages = [
  // existing messages...
];

// Create a global variable to store conversation IDs
const conversationIds = {};

const getConversationsForUser = (userId) => {
  const conversations = {};

  messages.forEach((message) => {
    const fromUserId = message.fromUserId;
    const toUserId = message.toUserId;
    const listingId = message.listingId;
    const conversationKey = `${Math.min(fromUserId, toUserId)}-${Math.max(
      fromUserId,
      toUserId
    )}-${listingId}`;

    // Check if the conversation key exists in the conversationIds
    let conversationId = conversationIds[conversationKey];
    if (!conversationId) {
      // If the conversation doesn't exist, generate a new conversation ID
      conversationId = uuidv4();
      conversationIds[conversationKey] = conversationId;
    }

    if (!conversations[conversationId]) {
      conversations[conversationId] = {
        key: conversationId,
        user: usersStore.getUserById(toUserId),
        messages: [],
      };
    }

    conversations[conversationId].messages.push(message);
  });

  // Add default key for conversations without a key
  Object.values(conversations).forEach((conversation) => {
    if (!conversation.key) {
      conversation.key = uuidv4();
    }
  });

  return Object.values(conversations);
};

const getMessagesForConversation = (conversationId) => {
  // Fetch messages for the specified conversationId from your data store
  console.log("messages = ", messages);
  const messagesForConversation = messages.filter(
    (message) => message.conversationId === conversationId
  );

  return messagesForConversation;
};

const add = (conversationId, message) => {
  // Generate a unique identifier using uuid for the new message
  message.id = uuidv4();
  message.dateTime = Date.now();
  message.conversationId = conversationId; // Add this line to set the conversation ID

  messages.push(message);
};

const addMessageToConversation = (conversationId, newMessage) => {
  const conversation = messages.find(
    (conv) => conv.conversationId === conversationId
  );

  if (conversation) {
    conversation.messages.push(newMessage);
  } else {
    // If conversation not found, you might want to handle this case
    console.log("Conversation not found while adding message.");
  }
};

module.exports = {
  add,
  getConversationsForUser,
  getMessagesForConversation,
  addMessageToConversation,
};