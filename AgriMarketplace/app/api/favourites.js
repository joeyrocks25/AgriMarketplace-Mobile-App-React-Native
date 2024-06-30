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
    console.log("Get Favourites API Endpoint:", fullEndpoint); // Log the endpoint

    const response = await client.get(fullEndpoint);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addFavourite = async (favourite) => {
  try {
    const fullEndpoint = client.getBaseURL() + endpoint;
    console.log("Add Favourite API Endpoint:", fullEndpoint); // Log the endpoint

    const fullRegisterEndpoint = fullEndpoint + "/add";
    console.log("API Endpoint favourite add:", fullRegisterEndpoint);

    console.log("favourite ", favourite);

    const response = await client.post(fullRegisterEndpoint, favourite);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteFavouriteById = async (favouriteId) => {
  try {
    const fullEndpoint = endpoint + `/${favouriteId}`;
    console.log("Delete Favourite API Endpoint:", fullEndpoint); // Log the endpoint

    const response = await client.delete(fullEndpoint);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default {
  addFavourite,
  getFavourites,
  deleteFavouriteById,
};
