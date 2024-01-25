const users = [
  {
    id: "34ffda8f-7492-4a52-a80c-76f5a8a431e00",
    username: "jo1",
    name: "john",
    email: "john@domain.com",
    password: "12345",
    profileImage: "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg", // Add the profileImage property
  },
  {
    id: "2",
    username: "kcunningham1",
    name: "KP Cunningham",
    email: "kp@gmail.com",
    password: "12345",
    profileImage: "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg", // Add the profileImage property
  },
  {
    id: "3",
    username: "kcunningham123",
    name: "KP Cunninghammm",
    email: "1",
    password: "1",
    profileImage: "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg", // Add the profileImage property
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
