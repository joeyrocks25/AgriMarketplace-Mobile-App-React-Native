const express = require("express");
const router = express.Router();

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");

router.get("/:id", auth, (req, res) => {
  const userId = req.params.id;
  const user = usersStore.getUserById(userId);

  if (!user) {
    return res.status(404).send({ error: "User not found." });
  }

  const listings = listingsStore.filterListings(
    (listing) => listing.userId === userId
  );

  // Include the profile image in the response, use default if null
  const defaultProfileImage = "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg";
  const profileImage = user.profileImage || defaultProfileImage;

  const response = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    listings: listings.length,
    profileImage,
  };

  res.send(response);
});

module.exports = router;
