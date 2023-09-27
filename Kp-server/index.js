const express = require("express");
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const listing = require("./routes/listing");
const users = require("./routes/users");
const user = require("./routes/user");
const auth = require("./routes/auth");
const my = require("./routes/my");
const messages = require("./routes/messages"); // Updated route for conversations
const expoPushTokens = require("./routes/expoPushTokens");
const favourites = require("./routes/favourites");

const app = express();
const port = 9000;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware to parse JSON bodies and increase payload size limit
app.use(express.json({ limit: "10mb" }));

// Middleware to serve static files
app.use(express.static("public"));

// Listings router
app.use("/api/listings", listings);

// Authentication router
app.use("/api/auth", auth);

// Users router
app.use("/api/user", user);

// Expo push tokens router
app.use("/api/expoPushTokens", expoPushTokens);

app.use("/api/categories", categories);

app.use("/api/listing", listing);

app.use("/api/users", users);

app.use("/api/my", my);

// Conversations router
app.use("/api/messages", messages); // Updated endpoint for conversations

app.use("/api/favourites", favourites);

// Middleware to log requests and request body
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log("Request Body:", req.body); // Log the request body
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
