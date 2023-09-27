import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get(endpoint);

export const addListing = async (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.value);
  data.append("description", listing.description);

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

export default {
  addListing,
  getListings,
};
