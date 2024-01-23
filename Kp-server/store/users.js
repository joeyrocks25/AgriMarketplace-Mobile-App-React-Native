const users = [
  {
    id: 1,
    username: "jo1",
    name: "john",
    email: "john@domain.com",
    password: "12345",
    profileImage: null, // Add the profileImage property
  },
  {
    id: 2,
    username: "kcunningham1",
    name: "KP Cunningham",
    email: "kp@gmail.com",
    password: "12345",
    profileImage: null, // Add the profileImage property
  },
  {
    id: 3,
    username: "kcunningham123",
    name: "KP Cunninghammm",
    email: "1",
    password: "1",
    profileImage: null, // Add the profileImage property
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
  users.push(user);
}

module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  addUser,
};
