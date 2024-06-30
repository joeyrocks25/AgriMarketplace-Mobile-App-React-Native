import client from "./client";

const getConversations = async (authToken) => {
  try {
    const endpoint = "/messages";
    console.log("Calling getConversations API with authToken:", authToken);
    console.log("get messages Endpoint:", endpoint);
    const response = await client.get(endpoint, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("Get Conversations response:", response.data); // Log the response
    return response;
  } catch (error) {
    console.log("Error in getConversations API:", error);
    throw error;
  }
};

const getMessagesForConversation = async (authToken, conversationId) => {
  try {
    console.log(
      "Calling getMessagesForConversation API with authToken:",
      authToken
    );
    console.log("Conversation ID:", conversationId);
    const response = await client.get(`/messages/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("Get Messages for Conversation response:", response.data); // Log the response
    return response;
  } catch (error) {
    console.log("Error in getMessagesForConversation API:", error);
    throw error;
  }
};

const send = async (message, listingId) => {
  try {
    console.log("Calling send API with message:", message);
    console.log("Listing ID:", listingId);

    const endpoint = "/messages";
    const payload = {
      message,
      listingId,
    };

    console.log("Endpoint:", endpoint);
    console.log("Payload:", payload);

    const response = await client.post(endpoint, payload);
    console.log("Send response:", response.data); // Log the response
    return response;
  } catch (error) {
    console.log("Error in send API:", error);
    throw error;
  }
};

const sendReplyToConversation = async (
  authToken,
  conversationId,
  message,
  listingId
) => {
  try {
    console.log(
      "Calling sendReplyToConversation API with authToken:",
      authToken
    );
    console.log("Conversation ID:", conversationId);
    const response = await client.post(
      `/messages/reply/${conversationId}`,
      {
        message,
        listingId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log("Send Reply to Conversation response:", response.data); // Log the response
    return response;
  } catch (error) {
    console.log("Error in sendReplyToConversation API:", error);
    throw error;
  }
};

export default {
  getConversations,
  getMessagesForConversation,
  send,
  sendReplyToConversation,
};
