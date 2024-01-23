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

router.post("/", async (req, res) => {
  let username, name, email, password, profileImage;

  // Extract values from _parts
  const usernamePart = req.body._parts.find(part => part[0] === 'username');
  const namePart = req.body._parts.find(part => part[0] === 'name');
  const emailPart = req.body._parts.find(part => part[0] === 'email');
  const passwordPart = req.body._parts.find(part => part[0] === 'password');
  const profileImagePart = req.body._parts.find(part => part[0] === 'profileImage');

  // Assign values if found, otherwise set them to undefined
  username = usernamePart ? usernamePart[1] : undefined;
  name = namePart ? namePart[1] : undefined;
  email = emailPart ? emailPart[1] : undefined;
  password = passwordPart ? passwordPart[1] : undefined;
  profileImage = profileImagePart ? profileImagePart[1] : undefined;

  const uuid = uuidv4();

  try {
    // Process and save profile image logic
    if (profileImage) {
      console.log("test1");
      const filename = `${username.replace(/\s+/g, "-")}-${uuid}`;
      const fullImagePath = path.join(outputFolder, `${filename}_full.jpg`);
      const thumbImagePath = path.join(outputFolder, `${filename}_thumb.jpg`);

      const binaryData = Buffer.from(
        profileImage.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      await fs.promises.writeFile(fullImagePath, binaryData);

      await sharp(binaryData)
        .resize(200)
        .jpeg({ quality: 50 })
        .toFile(thumbImagePath);

      const url = `${baseUrl}${filename}_full.jpg`;
      const newUser = {
        id: uuid,
        username,
        name,
        email,
        password,
        profileImage: url,
      };

      usersStore.addUser(newUser);

      // Use userMapper instead of listingMapper
      const resource = userMapper(newUser);
      console.log("Response resource:", resource); // Log the resource before sending
      res.status(201).send(resource);
    } else {
      console.log("test2");
      // If no profile image, create user without profileImage property
      const newUser = {
        id: uuid,
        username,
        name,
        email,
        password,
        profileImage: null,
      };

      usersStore.addUser(newUser);

      // Use userMapper instead of listingMapper
      const resource = userMapper(newUser);
      console.log("Response resource:", resource); // Log the resource before sending
      res.status(201).send(resource);
    }
  } catch (error) {
    console.error("Error processing and saving profile image:", error);
    return res
      .status(500)
      .send({ error: "Error processing and saving profile image." });
  }
});


router.get("/", (req, res) => {
  const { id } = req.query;
  if (id) {
    const user = usersStore.getUserById(Number(id));
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ error: "User not found." });
    }
  } else {
    res.send(usersStore.getUsers());
  }
});

module.exports = router;
