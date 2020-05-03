const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

//traer el username & room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//unirse al room
socket.emit("joinRoom", { username, room });

socket.on("message", (message) => {
  //console.log(message);
  outputMessage(message);
  //scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//envio de mensaje
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value; //traer el mensaje
  //console.log(msg);
  socket.emit("chatMessage", msg); //EMITE AL SERV. on submit

  e.target.elements.msg.value = "";
  e.target.elements.focus();
});

//enviar el mensaje al ODM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

//get room & users
socket.on("roomUsers", ({ room, users }) => {
  //outputRoomName(room)
  outputUsers(users);
});

//add roomname to dom
/* const outputRoomName = (params) => {
  
} */
//add users to the dom
const outputUsers = (users) => {
  usersList.innerHTML = `
    ${users.map((user) => `<p>${user.username}</p>`).join("")}
  `;
};

roomName.innerHTML = room;
