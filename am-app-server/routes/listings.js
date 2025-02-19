const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const store = require("../store/listings");
const categoriesStore = require("../store/categories");
const listingMapper = require("../mappers/listings");
const config = require("config");

const outputFolder = path.join(__dirname, "../public/assets");
const baseUrl = config.get("assetsBaseUrl");

// Route handler for creating a new listing
router.post("/", async (req, res) => {
  const { title, price, categoryId, description, images, location, userId } =
    req.body;

  console.log("Request Body:", req.body);

  // Validate the request body
  if (!title || !price || !categoryId) {
    return res.status(400).send({ error: "Invalid request body." });
  }

  // Validate the category ID
  const categoryIdInt = parseInt(categoryId);
  if (!categoriesStore.getCategory(categoryIdInt)) {
    return res.status(400).send({ error: "Invalid categoryId." });
  }

  // Validate the maximum image count
  if (images && images.length > 3) {
    return res.status(400).send({ error: "Maximum image count exceeded." });
  }

  const uuid = uuidv4();

  // Image processing and saving logic
  if (images) {
    try {
      const processedImages = await Promise.all(
        images.map(async (image) => {
          const filename = `${title.replace(/\s+/g, "-")}-${uuid}`; // Create a filename using the title and the UUID
          const fullImagePath = path.join(outputFolder, `${filename}_full.jpg`);
          const thumbImagePath = path.join(
            outputFolder,
            `${filename}_thumb.jpg`
          );

          // Decode the base64 data to binary
          const base64DataWithoutPrefix = image.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const binaryData = Buffer.from(base64DataWithoutPrefix, "base64");

          // Save the binary data to a file
          await fs.promises.writeFile(fullImagePath, binaryData);

          // Resize and create a thumbnail
          await sharp(binaryData)
            .resize(200)
            .jpeg({ quality: 50 })
            .toFile(thumbImagePath);

          const url = `${baseUrl}${filename}_full.jpg`; // URL for the full image
          const thumbnailUrl = `${baseUrl}${filename}_thumb.jpg`; // URL for the thumbnail
          console.log("Filename:", filename);
          console.log("URL:", url);
          console.log("Thumbnail URL:", thumbnailUrl);

          return {
            url,
            thumbnailUrl,
            fileName: filename,
          };
        })
      );

      // Replace the original images array with the processed images
      images.splice(0, images.length, ...processedImages);
    } catch (error) {
      console.error("Error processing and saving images:", error);
      return res
        .status(500)
        .send({ error: "Error processing and saving images." });
    }
  }

  // Create a new listing object
  const newListing = {
    id: uuid,
    title,
    price: parseFloat(price),
    categoryId: categoryIdInt,
    description: description || "",
    images: images.map((image) => ({
      ...image,
      fileName: `${title.replace(/\s+/g, "-")}-${uuid}`, // note assign same UUID as the filename
    })),
    location: location || null,
    userId,
  };

  // Add the new listing to the store
  store.addListing(newListing);

  // Return the newly created listing
  const resource = listingMapper(newListing);
  res.status(201).send(resource);
});

// New route handler for updating a listing by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, categoryId, description, images, location } = req.body;

  const listingId = parseInt(id);
  if (isNaN(listingId) || listingId <= 0) {
    return res.status(400).send({ error: "Invalid listing ID." });
  }

  const listingIndex = store
    .getListings()
    .findIndex((item) => item.id === listingId);
  if (listingIndex === -1) {
    return res.status(404).send({ error: "Listing not found." });
  }

  const listing = store.getListings()[listingIndex];

  if (title) {
    listing.title = title;
  }
  if (price) {
    listing.price = parseFloat(price);
  }
  if (categoryId) {
    const categoryIdInt = parseInt(categoryId);
    if (!categoriesStore.getCategory(categoryIdInt)) {
      return res.status(400).send({ error: "Invalid categoryId." });
    }
    listing.categoryId = categoryIdInt;
  }
  if (description) {
    listing.description = description;
  }
  if (images) {
    try {
      // Process and update images
      const processedImages = await Promise.all(
        images.map(async (image) => {
          const filename = `${title.replace(/\s+/g, "-")}-${listingId}`;
          const fullImagePath = path.join(outputFolder, `${filename}_full.jpg`);
          const thumbImagePath = path.join(
            outputFolder,
            `${filename}_thumb.jpg`
          );

          const base64DataWithoutPrefix = image.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const binaryData = Buffer.from(base64DataWithoutPrefix, "base64");

          await fs.promises.writeFile(fullImagePath, binaryData);

          await sharp(binaryData)
            .resize(200)
            .jpeg({ quality: 50 })
            .toFile(thumbImagePath);

          const url = `${baseUrl}${filename}_full.jpg`;
          const thumbnailUrl = `${baseUrl}${filename}_thumb.jpg`;

          return {
            url,
            thumbnailUrl,
            fileName: filename,
          };
        })
      );

      // Replace existing images with processed images
      listing.images = processedImages;
    } catch (error) {
      console.error("Error processing and saving images:", error);
      return res
        .status(500)
        .send({ error: "Error processing and saving images." });
    }
  }
  if (location) {
    listing.location = location;
  }

  // Update the listing in the store
  store.getListings()[listingIndex] = listing;

  const resource = listingMapper(listing);
  res.send(resource);
});

// Route handler for fetching all listings
router.get("/", (req, res) => {
  const { userId, categoryId } = req.query;
  const listings = store.getListings();

  let filteredListings = listings;
  let userListingsCount = 0;

  console.log("userid", userId);
  if (userId) {
    // Filter the listings based on the userId
    filteredListings = filteredListings.filter(
      (listing) => listing.userId == userId
    );
    console.log("userid", userId);
    userListingsCount = store.countListingsByUserId(userId);
  }

  if (categoryId) {
    // Filter the listings based on the categoryId
    filteredListings = filteredListings.filter(
      (listing) => listing.categoryId == categoryId
    );
  }

  // userListingsCount = filteredListings.length; // Count the number of filtered listings

  const resources = filteredListings.map((listing) => {
    const resource = listingMapper(listing);
    console.log("user listing count", userListingsCount);
    resource.userListingsCount = userListingsCount;
    console.log("resource:", resource);
    return resource;
  });

  res.send(resources);
});

// New route handler for searching listings
router.get("/search", (req, res) => {
  const { searchText } = req.query;
  console.log("Received search request with searchText:", searchText);

  // Perform the search in the store based on the searchText
  const searchResults = store.searchListings(searchText);

  const resources = searchResults.map((listing) => {
    const resource = listingMapper(listing);
    return resource;
  });

  res.send(resources);
});

// New route handler for getting a listing by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Validate that the ID is a positive integer
  const listingId = parseInt(id);
  if (isNaN(listingId) || listingId <= 0) {
    return res.status(400).send({ error: "Invalid listing ID." });
  }

  // Find the listing in the store by ID
  const listing = store.getListing(listingId);

  // If the listing is not found, return a 404 error
  if (!listing) {
    return res.status(404).send({ error: "Listing not found." });
  }

  // Map the listing and send it as a response
  const resource = listingMapper(listing);
  res.send(resource);
});

// New route handler for deleting a listing by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Validate that the ID is a positive integer
  const listingId = parseInt(id);
  if (isNaN(listingId) || listingId <= 0) {
    return res.status(400).send({ error: "Invalid listing ID." });
  }

  // Find the index of the listing in the store by ID
  const index = store.getListings().findIndex((item) => item.id === listingId);

  // If the listing is not found, return a 404 error
  if (index === -1) {
    return res.status(404).send({ error: "Listing not found." });
  }

  // Remove the listing from the store
  store.getListings().splice(index, 1);

  // Send a success response with a message confirming the deletion
  res.status(200).send({ message: "Listing deleted successfully." });
});

module.exports = router;
