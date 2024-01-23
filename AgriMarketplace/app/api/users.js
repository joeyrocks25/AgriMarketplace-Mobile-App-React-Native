import client from "./client";
import axios from "axios";

const fullEndpoint = client.getBaseURL() + "/users";

// Function to register a user with a profile photo
export const registerWithProfilePhoto = async (userInfo, onUploadProgress) => {
  console.log("API Endpointttt:", fullEndpoint);
  // console.log("User data is:", userInfo)
  const data = new FormData();
  data.append("username", userInfo.username);
  data.append("name", userInfo.name);
  data.append("email", userInfo.email);
  data.append("password", userInfo.password);
  data.append("profileImage", userInfo.profilePhoto);

  try {
    console.log("Sending request to register a user with profile photo..");
    // console.log("data = ", data)
    const response = await fetch(fullEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

    const responseData = await response.json();
    console.log("Response from the server:", responseData);

    if (!response.ok) {
      // Handle error if the response status is not OK
      throw new Error(responseData.error || "An unexpected error occurred.");
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    // if (error.response) {
    //   // The request was made and the server responded with a status code
    //   // that falls out of the range of 2xx
    //   console.error("Server responded with status code:", error.response.status);
    //   console.error("Response data:", error.response.data);
    //   console.error("Response headers:", error.response.headers);
    // } else if (error.request) {
    //   // The request was made but no response was received
    //   console.error("No response received. Request details:", error.request);
    // } else {
    //   // Something happened in setting up the request that triggered an Error
    //   console.error("Error setting up the request:", error.message);
    // }
    // throw error;
  }
};


// Function to get user information by ID
export const getUser = (id) => {
  const parsedId = parseInt(id, 10);
  const fullEndpoint = client.getBaseURL() + "/users" + `?id=${parsedId}`;
  console.log("API Endpoint:", fullEndpoint);

  const request = client.get(fullEndpoint);

  return request;
};

export default {
  registerWithProfilePhoto,
  getUser,
};