import client from "./client";

const endpoint = "/listings";
const endpoint2 = "/listing";

const getListingById = async (id) => {
  try {
    const fullEndpoint = client.getBaseURL() + endpoint2 + `/${id}`;
    console.log("Get Listing by ID API Endpoint:", fullEndpoint); // Log the endpoint
    const response = await client.get(fullEndpoint);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const addListing = async (listing) => {
  const fullEndpoint = client.getBaseURL() + endpoint;
  console.log("Add Listing API Endpoint:", fullEndpoint); // Log the endpoint

  try {
    const response = await fetch(fullEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listing),
    });

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      console.error("API Error:", result.error || "Could not save the listing");
      return Promise.reject("Could not save the listing");
    }

    return result;
  } catch (error) {
    console.error("Network Error:", error);
    throw error;
  }
};

const getListings = async (userId, categoryId) => {
  try {
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : null;

    let queryString = "";

    if (userId) {
      queryString += `userId=${userId}`;
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
    console.log("Get Listings API Endpoint:", fullEndpoint); // Log the endpoint

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

    console.log("Get Listings by Search API Endpoint:", fullEndpoint); // Log the endpoint

    const response = await client.get(fullEndpoint);
    const searchResults = response.data; // Extract the search results from the response

    console.log("Search results:", searchResults); // Log the search results

    return searchResults;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const deleteListingById = async (listingId) => {
  try {
    const fullEndpoint = client.getBaseURL() + endpoint + `/${listingId}`;
    console.log("Delete Listing by ID API Endpoint:", fullEndpoint); // Log the endpoint

    const response = await client.delete(fullEndpoint);

    return response.data; // You can adjust this based on the expected response from your backend
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
  deleteListingById,
};
