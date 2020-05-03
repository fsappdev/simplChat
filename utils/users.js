const users = [];

//join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

//get el usario actual
const getCurrentUser = (id) => {
  return users.find((user) => user.id == id);
};

//usuario abandona el chat
const userLeaves = (id) => {
  const index = users.findIndex((user) => user.id == id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//traer los users del room
const getRoomUsers = (room) => {
  return users.filter((user) => user.room == room);
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
};
