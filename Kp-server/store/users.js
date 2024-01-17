const users = [
  {
    id: 1,
    username: "jo1",
    name: "john",
    email: "john@domain.com",
    password: "12345",
  },
  {
    id: 2,
    username: "kcunningham1",
    name: "KP Cunningham",
    email: "kp@gmail.com",
    password: "12345",
  },
  {
    id: 3,
    username: "kcunningham123",
    name: "KP Cunninghammm",
    email: "1",
    password: "1",
  },
];

function getUsers() {
  return users;
}

function getUserById(id) {
  return users.find((user) => user.id === id);
}

function getUserByEmail(email) {
  return users.find((user) => user.email === email);
}

function addUser(user) {
  user.id = users.length + 1;
  users.push(user);
}

module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  addUser,
};
