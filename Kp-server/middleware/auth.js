const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log("Token:", token);

  if (!token)
    return res.status(401).send({ error: "Access denied. No token provided." });

  try {
    const payload = jwt.verify(token, "jwtPrivateKey");
    console.log("Token payload:", payload);
    req.user = payload;
    next();
  } catch (err) {
    console.log("Invalid token:", err.message);
    res.status(400).send({ error: "Invalid token." });
  }
};
