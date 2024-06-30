const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const usersStore = require("../store/users");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const config = require("config");

const outputFolder = path.join(__dirname, "../public/assets");
const baseUrl = config.get("assetsBaseUrl");

// Define a user mapper function
const userMapper = (user) => {
  const mappedUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
  };

  // Include profileImage property only if it's present and not null
  if (user.profileImage !== null && user.profileImage !== undefined) {
    mappedUser.profileImage = user.profileImage;
  }

  return mappedUser;
};

router.post("/register", async (req, res) => {
  const { username, name, email, password, profilePhoto } = req.body;

  const uuid = uuidv4();

  try {
    // Process and save profile photo logic
    if (profilePhoto) {
      const filename = `${username.replace(/\s+/g, "-")}-${uuid}`;
      const fullImagePath = path.join(outputFolder, `${filename}_full.jpg`);
      const thumbImagePath = path.join(outputFolder, `${filename}_thumb.jpg`);

      // Decode Base64 data
      const binaryData = Buffer.from(
        profilePhoto.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      // Write the image file
      await fs.promises.writeFile(fullImagePath, binaryData);

      // Resize and create a thumbnail
      await sharp(binaryData)
        .resize(200)
        .jpeg({ quality: 50 })
        .toFile(thumbImagePath);

      // Set the URL for the full image
      const url = `${baseUrl}${filename}_full.jpg`;

      // Create a new user object with the profile image URL
      const newUser = {
        id: uuid,
        username,
        name,
        email,
        password,
        profileImage: url,
      };

      // Add the new user to the store
      usersStore.addUser(newUser);

      // Map the user data and send the response
      const resource = userMapper(newUser);
      console.log("Response resource:", resource);
      res.status(201).send(resource);
    } else {
      // If no profile photo provided, create user without profileImage property
      const newUser = {
        id: uuid,
        username,
        name,
        email,
        password,
        profileImage: null,
      };

      // Add the new user to the store
      usersStore.addUser(newUser);

      // Map the user data and send the response
      const resource = userMapper(newUser);
      console.log("Response resource:", resource);
      res.status(201).send(resource);
    }
  } catch (error) {
    console.error("Error processing and saving profile photo:", error);
    return res
      .status(500)
      .send({ error: "Error processing and saving profile photo." });
  }
});

// Route handler for updating a user by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { username, name, email } = req.body;

  const user = usersStore.getUserById(id);
  if (!user) {
    return res.status(404).send({ error: "User not found." });
  }

  if (username) {
    user.username = username;
  }
  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }

  usersStore.updateUser(user);

  // Map the updated user data and send the response
  const resource = userMapper(user);
  res
    .status(200)
    .send({ message: "User updated successfully.", user: resource });
});

// Route handler for deleting a user by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const user = usersStore.getUserById(id);
  if (!user) {
    return res.status(404).send({ error: "User not found." });
  }

  // Delete the user from the store
  usersStore.deleteUser(id);

  res.status(200).send({ message: "User deleted successfully." });
});

router.get("/", (req, res) => {
  const { id } = req.query;
  if (id) {
    const user = usersStore.getUserById(id);
    if (user) {
      // Use the default profile image if user doesn't have one
      const defaultProfileImage =
        "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg";
      const profileImage = user.profileImage || defaultProfileImage;

      // Add the profileImage property to the user object
      const userWithProfileImage = { ...user, profileImage };

      res.send(userWithProfileImage);
    } else {
      res.status(404).send({ error: "User not found." });
    }
  } else {
    // Use the default profile image for each user who doesn't have one
    const defaultProfileImage =
      "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg";
    const usersWithProfileImages = usersStore.getUsers().map((user) => ({
      ...user,
      profileImage: user.profileImage || defaultProfileImage,
    }));

    res.send(usersWithProfileImages);
  }
});

module.exports = router;
