import client from "./client";

const login = (email, password) => {
  const endpoint = "/auth/login";
  const fullEndpoint = client.getBaseURL() + endpoint;
  console.log("Login API Endpoint:", fullEndpoint); // Log the endpoint
  return client.post(endpoint, { email, password });
};

// add this to users???
const getMessages = (authToken) => {
  const endpoint = "/messages";
  const fullEndpoint = client.getBaseURL() + endpoint;
  console.log("Get Messages API Endpoint:", fullEndpoint); // Log the endpoint
  return client.get(endpoint, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export default {
  login,
  getMessages,
};
