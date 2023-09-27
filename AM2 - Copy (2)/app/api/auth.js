import client from "./client";

const login = (email, password) => client.post("/auth", { email, password });

const getMessages = (authToken) =>
  client.get("/messages", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export default {
  login,
  getMessages,
};
