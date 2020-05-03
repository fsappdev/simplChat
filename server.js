const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessages = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "chatobot";

//carpetas estaticas
app.use(express.static(path.join(__dirname, "public")));

//evento de conexion del cliente
io.on("connection", (socket) => {
  //
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessages(botName, "Bienvenido al chat"));
    //
    //transmite cuando UN usuario se conecta al resto
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessages(botName, `${user.username} se ha unido al chat`)
      );

    //enviar info de los users y del room
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //
  //escuchar por los mensajes
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessages(user.username, msg));
  });
  //
  //cuando un user se desconecta
  socket.on("disconnect", () => {
    const user = userLeaves(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessages(botName, `${user.username} ha dejado el chat`)
      );
      //enviar info de los users y del room
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//seteo del port y listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`SERVIDOR DE CHAT CORRIENDO EN EL PUERTO ${PORT}`);
});
