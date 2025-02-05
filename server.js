
const io = require("socket.io")(server);
let users = {}; 
let groups = {}; 

io.on("connection", (socket) => {
  console.log('A user connected');

 
  socket.on("addUser", (username) => {
    users[socket.id] = username;
    io.emit("updateUserList", Object.values(users)); 
  });

  
  socket.on("sendMessage", ({ sender, recipientId, message, group }) => {
    if (group) {
      
      if (groups[group]) {
        groups[group].forEach((member) => {
          const memberSocketId = Object.keys(users).find(
            (socketId) => users[socketId] === member
          );
          if (memberSocketId) {
            io.to(memberSocketId).emit("receiveMessage", { sender, message, group });
          }
        });
      }
    } else {
      
      io.to(recipientId).emit("receiveMessage", { sender, message });
    }
  });

  
  socket.on("createGroup", ({ groupName, members }) => {
    if (!groups[groupName]) {
      groups[groupName] = members;
      members.forEach((member) => {
        const memberSocketId = Object.keys(users).find(
          (socketId) => users[socketId] === member
        );
        if (memberSocketId) {
          io.to(memberSocketId).emit("joinGroup", groupName);
        }
      });
    } else {
      io.to(socket.id).emit("groupError", "Group already exists");
    }
  });

 
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateUserList", Object.values(users));
  });
});
