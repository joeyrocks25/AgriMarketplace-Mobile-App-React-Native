const express = require("express");
const router = express.Router();
const Joi = require("joi");
const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");

const schema = Joi.object({
  username: Joi.string().required().min(2),
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
});

router.post("/", validateWith(schema), (req, res) => {
  const { username, name, email, password } = req.body;
  if (usersStore.getUserByEmail(email))
    return res
      .status(400)
      .send({ error: "A user with the given email already exists." });

  const user = { username, name, email, password };
  usersStore.addUser(user);

  res.status(201).send(user);
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
