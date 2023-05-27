const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Chat App Socket IO is working fine. Go ahead!");
});

app.get("/index.php", (req, res) => {
  res.send("Chat App Socket IO is working fine. Go ahead!");
});

io.on("connection", (socket) => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL

  //   For joining a room from client side | roomId from client side
  socket.on("join", function (room) {
    socket.join(room);
    io.to(room).emit("fetchPreviousMsgs");
  });

  // Receive msg from client and send back to opposite user
  socket.on("newMsg", (newChat) => {
    console.log(newChat);
    io.to(newChat.room).emit("upcomingMsg", newChat);
  });

  // When user is typing then send into room
  socket.on("msg_typing", (user) => {
    console.log(user);
    io.to(user.room).emit("user_typing", user);
  });
});

httpServer.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
