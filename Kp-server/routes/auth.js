const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersStore = require("../store/users"); // Update the path accordingly

// Define the validation schema for the request body
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
});

// POST /api/auth
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = usersStore.getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(400).send({ error: "Invalid email or password." });
  }

  // Generate a JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      name: user.name,
      password: user.password,
      email,
    },
    "jwtPrivateKey" // Replace with your actual private key
  );

  // Log the token
  console.log("Token:", token);

  res.send(token);
});

module.exports = router;
