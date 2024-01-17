import client from "./client";

const register = (userInfo) => client.post("/users", userInfo);

const getUser = (id) => {
  const parsedId = parseInt(id, 10);
  const fullEndpoint = client.getBaseURL() + "/users" + `?id=${parsedId}`;
  console.log("API Endpoint:", fullEndpoint); // Log the endpoint

  const request = client.get(fullEndpoint);

  return request;
};

export default {
  register,
  getUser,
};
