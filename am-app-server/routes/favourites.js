const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const store = require("../store/favourites");
const auth = require("../middleware/auth");

const { isFavouriteAlreadyExists } = require("../store/favourites");

// Define the route handler for creating a new favourite
router.post("/add", auth, (req, res) => {
  const { currentUserId, listingId } = req.body;

  // Validate the request body
  if (!currentUserId || !listingId) {
    return res.status(400).send({ error: "Invalid request body." });
  }

  // Check if a favorite already exists for the given currentUserId and listingId
  const isFavouriteExists = isFavouriteAlreadyExists(currentUserId, listingId);
  if (isFavouriteExists) {
    return res.status(400).send({ error: "Favorite already exists." });
  }

  // Create a new favourite object
  const newFavourite = {
    id: uuidv4(),
    currentUserId,
    listingId,
    title: req.body.title,
    description: req.body.description,
    images: req.body.images,
    price: req.body.price,
    categoryId: req.body.categoryId,
    userId: req.body.userId,
    location: req.body.location,
  };

  // Add the new favourite to the store
  store.addFavourite(newFavourite);

  res.status(201).send(newFavourite);
});

// Define the route handler for fetching all favourites
router.get("/", auth, (req, res) => {
  const { currentUserId } = req.query; // Get the currentUserId from the query parameters

  const favourites = store.getFavourites();

  let filteredFavourites = favourites;

  if (currentUserId) {
    // Filter the favourites based on the currentUserId
    filteredFavourites = filteredFavourites.filter(
      (favourite) => favourite.currentUserId == currentUserId
    );
  }

  res.send(filteredFavourites);
});

// Define the route handler for deleting a favourite by ID
router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;

  const favourite = store.getFavourite(id);
  if (!favourite) {
    return res.status(404).send({ error: "Favourite not found." });
  }

  // Delete the favourite from the store
  store.deleteFavourite(id);

  res.status(200).send({ message: "Favourite deleted successfully." });
});

module.exports = router;
