import client from "./client";

const usersEndpoint = client.getBaseURL() + "/users";

// Function to register a user with a profile photo
export const registerWithProfilePhoto = async (userInfo) => {
  const registerEndpoint = usersEndpoint + "/register";
  console.log("API Endpoint register user:", registerEndpoint);

  try {
    console.log("Sending request to register a user with profile photo..");
    const response = await fetch(registerEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    const responseData = await response.json();
    console.log("Response from the server:", responseData);

    if (!response.ok) {
      throw new Error(responseData.error || "An unexpected error occurred.");
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Function to update user information
export const updateUser = async (id, userData) => {
  const updateEndpoint = `${usersEndpoint}/${id}`;
  console.log("API Endpoint for updating user:", updateEndpoint);

  try {
    console.log("Sending request to update user information..");
    const response = await fetch(updateEndpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    console.log("Response from the server:", responseData);

    if (!response.ok) {
      throw new Error(responseData.error || "An unexpected error occurred.");
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Function to delete a user
export const deleteUser = async (id) => {
  const deleteEndpoint = `${usersEndpoint}/${id}`;
  console.log("API Endpoint for deleting user:", deleteEndpoint);

  try {
    console.log("Sending request to delete user..");
    const response = await fetch(deleteEndpoint, {
      method: "DELETE",
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.error || "An unexpected error occurred.");
    }

    console.log("User deleted successfully.");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Function to get user information by ID
export const getUser = async (id) => {
  const getUserEndpoint = `${usersEndpoint}?id=${id}`;
  console.log("API Endpoint for getting user:", getUserEndpoint);

  try {
    console.log("Sending request to get user information..");
    const response = await fetch(getUserEndpoint);

    const responseData = await response.json();
    console.log("Response from the server:", responseData);

    if (!response.ok) {
      throw new Error(responseData.error || "An unexpected error occurred.");
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default {
  registerWithProfilePhoto,
  updateUser,
  deleteUser,
  getUser,
};
