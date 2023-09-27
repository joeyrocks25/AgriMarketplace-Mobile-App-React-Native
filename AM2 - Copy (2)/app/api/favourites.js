import client from "./client";

const endpoint = "/favourites";

export const getFavourites = async (currentUserId) => {
  try {
    const parsedCurrentUserId = currentUserId
      ? parseInt(currentUserId, 10)
      : null;

    let queryString = "";

    if (parsedCurrentUserId) {
      queryString += `currentUserId=${parsedCurrentUserId}`;
    }

    const fullEndpoint =
      client.getBaseURL() +
      endpoint +
      (queryString !== "" ? `?${queryString}` : "");
    console.log("API Endpoint:", fullEndpoint); // Log the endpoint

    const response = await client.get(fullEndpoint);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addFavourite = async (favourite) => {
  try {
    const response = await client.post(endpoint, favourite);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default {
  addFavourite,
  getFavourites,
};
