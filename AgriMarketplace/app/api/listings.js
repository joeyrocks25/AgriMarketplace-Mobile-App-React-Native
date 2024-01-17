import client from "./client";

const endpoint = "/listings";

const endpoint2 = "/listing";

const getListingById = async (id) => {
  try {
    // console.log("test id", id);
    const fullEndpoint = client.getBaseURL() + endpoint2 + `/${id}`;
    console.log("API Endpointttt:", fullEndpoint); // Log the endpoint

    const response = await client.get(fullEndpoint);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addListing = async (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.value);
  data.append("description", listing.description);
  data.append("userId", listing.userId); // Include the userId from the listing

  listing.images.forEach((image, index) =>
    data.append("images", {
      name: "image" + index,
      type: "image/jpeg",
      uri: image,
    })
  );

  if (listing.location)
    data.append("location", JSON.stringify(listing.location));

  const fullEndpoint = client.getBaseURL() + endpoint;
  console.log("API Endpoint:", fullEndpoint); // Log the endpoint

  try {
    const response = await axios.post(fullEndpoint, data, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getListings = async (userId, categoryId) => {
  try {
    const parsedUserId = userId ? parseInt(userId, 10) : null;
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : null;

    let queryString = "";

    if (parsedUserId) {
      queryString += `userId=${parsedUserId}`;
    }

    if (parsedCategoryId) {
      if (queryString !== "") {
        queryString += "&";
      }
      queryString += `categoryId=${parsedCategoryId}`;
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

const getListingsBySearch = async (searchText) => {
  try {
    if (!searchText) {
      return []; // Return an empty array if no searchText is provided
    }

    const fullEndpoint =
      client.getBaseURL() + endpoint + "/search?searchText=" + searchText;

    console.log("API Endpoint:", fullEndpoint);

    const response = await client.get(fullEndpoint);
    const searchResults = response.data; // Extract the search results from the response

    console.log("Search results:", searchResults); // Log the search results

    return searchResults;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default {
  addListing,
  getListings,
  getListingById,
  getListingsBySearch,
};
