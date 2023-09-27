// conversationStore.js
const conversationKeyToIdMap = {};

const setConversationIdForKey = (conversationKey, conversationId) => {
  conversationKeyToIdMap[conversationKey] = conversationId;
};

const getConversationIdForKey = (conversationKey) => {
  return conversationKeyToIdMap[conversationKey];
};

module.exports = { setConversationIdForKey, getConversationIdForKey };
