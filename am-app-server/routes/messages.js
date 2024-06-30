const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Expo } = require("expo-server-sdk");
const { v4: uuidv4 } = require("uuid");

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const messagesStore = require("../store/messages");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");

const schema = Joi.object({
  listingId: Joi.number().required(),
  message: Joi.string().required(),
});

// Route to get all conversations for the authenticated user with their latest message
router.get("/", auth, (req, res) => {
  // Get conversations for the authenticated user using the messagesStore function
  const conversations = messagesStore.getConversationsForUser(req.user.userId);

  // Helper function to get the latest message from a conversation
  const getLatestMessage = (messages) => {
    const sortedMessages = messages.sort((a, b) => b.dateTime - a.dateTime);
    return sortedMessages.length > 0 ? sortedMessages[0] : null;
  };

  // Filter conversations to include only those involving the logged-in user
  const userConversations = conversations.filter((conversation) =>
    conversation.messages.some(
      (message) =>
        message.fromUserId === req.user.userId ||
        message.toUserId === req.user.userId
    )
  );

  // Map user conversations to the desired response format
  const resources = userConversations.map((conversation) => {
    // Get the latest message for the conversation
    const latestMessage = getLatestMessage(conversation.messages);

    // Construct the conversation response object with the latest message
    return {
      id: conversation.user.id,
      name: conversation.user.name,
      lastMessage: latestMessage,
    };
  });

  // Send the conversation resources in the response
  res.send(resources);
});

// Route to get messages for a specific conversation
router.get("/:conversationId", auth, (req, res) => {
  const conversationId = req.params.conversationId; // Use conversationUuid instead of conversationId

  // Fetch messages for the specified conversationUuid using the messagesStore function
  const messages = messagesStore.getMessagesForConversation(conversationId);

  // Return the messages in the response
  res.send(messages);
});

// Route to send a new message
router.post("/", [auth, validateWith(schema)], async (req, res) => {
  const { listingId, message } = req.body;

  // Get the listing from the store
  const listing = listingsStore.getListing(listingId);
  if (!listing) return res.status(400).send({ error: "Invalid listingId." });

  const targetUser = usersStore.getUserById(listing.userId);
  if (!targetUser) return res.status(400).send({ error: "Invalid userId." });

  const userId1 = req.user.userId;
  const userId2 = listing.userId;

  // Generate a conversation ID based on user IDs and listing ID
  const conversationId = [userId1, userId2, listingId].sort().join("-");

  // Pass the conversationId to the add function
  messagesStore.add(conversationId, {
    fromUserId: req.user.userId,
    toUserId: listing.userId,
    listingId,
    content: message,
    conversationId,
  });

  console.log("Request Headers:", req.headers);

  const { expoPushToken } = targetUser;

  if (Expo.isExpoPushToken(expoPushToken))
    await sendPushNotification(expoPushToken, message);

  res.status(201).send();
});

// Route to send a reply message
router.post(
  "/reply/:conversationId",
  [auth, validateWith(schema)],
  async (req, res) => {
    const { conversationId } = req.params;
    const { message } = req.body;

    // Find the conversation in your data store
    const conversation =
      messagesStore.getMessagesForConversation(conversationId);
    if (!conversation)
      return res.status(404).send({ error: "Conversation not found." });

    // Construct the new message
    const newMessage = {
      id: uuidv4(),
      fromUserId: req.user.userId,
      toUserId: conversation[0].fromUserId,
      listingId: conversation[0].listingId,
      content: message,
      dateTime: Date.now(),
      conversationId,
    };

    // add new message to the conversation
    messagesStore.add(conversationId, newMessage);

    console.log("New Reply Message:", newMessage);

    res.status(201).send();
  }
);

module.exports = router;
