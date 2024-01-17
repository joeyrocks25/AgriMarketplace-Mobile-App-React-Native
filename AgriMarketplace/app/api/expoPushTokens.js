import client from "./client";
import authStorage from "../auth/storage";
import axios from "axios";

const register = async (pushToken) => {
  const authToken = await authStorage.getToken();
  axios.defaults.headers.common["x-auth-token"] = authToken;

  console.log("Token is:", authToken); // Add this line to log the token

  return client.post("/expoPushTokens", { token: pushToken });
};

export default {
  register,
};
