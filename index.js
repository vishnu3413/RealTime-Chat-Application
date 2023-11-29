const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { log } = require("console");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log(name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    console.log("Sent");
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
