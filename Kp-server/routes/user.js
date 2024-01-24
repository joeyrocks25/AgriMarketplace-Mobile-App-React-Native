const express = require("express");
const router = express.Router();

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");

router.get("/:id", auth, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = usersStore.getUserById(userId);

  if (!user) {
    return res.status(404).send({ error: "User not found." });
  }

  const listings = listingsStore.filterListings(
    (listing) => listing.userId === userId
  );

  // Include the profile image in the response if available
  const response = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    listings: listings.length,
    profileImage: user.profileImage, // Assuming user has a profileImage property
  };

  res.send(response);
});

module.exports = router;
