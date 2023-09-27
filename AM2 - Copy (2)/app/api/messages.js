import client from "./client";

const getConversations = async (authToken) => {
  try {
    console.log("Calling getConversations API with authToken:", authToken);
    const response = await client.get("/messages", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("getConversations response:", response.data);
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
    console.log("getMessagesForConversation response:", response.data);
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
    const response = await client.post("/messages", {
      message,
      listingId,
    });
    console.log("send response:", response.data);
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
    console.log("sendReplyToConversation response:", response.data);
    return response;
  } catch (error) {
    console.log("Error in sendReplyToConversation API:", error);
    throw error;
  }
};

// const sendToConversation = async (conversationId, message, listingId) => {
//   try {
//     console.log("Calling sendToConversation API with message:", message);
//     console.log("Conversation ID:", conversationId);
//     const response = await client.post(`/messages/${conversationId}`, {
//       message,
//       listingId,
//     });
//     console.log("sendToConversation response:", response.data);
//     return response;
//   } catch (error) {
//     console.log("Error in sendToConversation API:", error);
//     throw error;
//   }
// };

export default {
  getConversations,
  getMessagesForConversation,
  send,
  sendReplyToConversation,
};
