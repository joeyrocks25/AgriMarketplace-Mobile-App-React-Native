// Dummy data
const users = [
  {
    id: "34ffda8f-7492-4a52-a80c-76f5a8a431e00",
    username: "Joeyrocks25",
    name: "Joey Rocks",
    email: "jr123@gmail.com",
    password: "Ireland14",
    profileImage:
      "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg",
  },
  {
    id: "2",
    username: "kcunningham1",
    name: "KP Cunningham",
    email: "kp@gmail.com",
    password: "Ireland14",
    profileImage:
      "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg",
  },
  {
    id: "3",
    username: "kcunningham123",
    name: "KP Cunninghammm",
    email: "1",
    password: "1",
    profileImage:
      "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg",
  },
  {
    id: "4",
    username: "test_user1",
    name: "test user",
    email: "test_user1@gmail.com",
    password: "test_user1123@",
    profileImage:
      "http://192.168.1.130:9000/assets/default_profile_photo_full.jpg",
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

function updateUser(updatedUser) {
  const index = users.findIndex((user) => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
  }
}

function deleteUser(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
  }
}

module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
