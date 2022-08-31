import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

const useUsers = () => {
  let users: { userId: string; socketId: string }[] | [] = [];

  const addUser = (userId: string, socketId: string) => {
    if (users.some(user => user.userId === userId)) return;

    users = [...users, { userId, socketId }];
  };

  const removeUser = (socketId: string) => {
    users = users.filter(user => user.socketId !== socketId);
  };

  const getUser = (userId: string) => {
    return users.find(user => user.userId === userId);
  };

  const get = () => users;

  return { addUser, removeUser, getUser, get };
};

const users = useUsers();

const socket = (server: HttpServer) => {
  const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });

  io.on('connection', socket => {
    console.log('a user connected');

    io.emit('welcome', 'Hello, you are connected with Socket IO server.');

    //take userId and socketId from user
    socket.on('addUser', userId => {
      console.log('User Added');
      users.addUser(userId, socket.id);
      io.emit('getUsers', users);
    });

    //send and get message
    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
      console.log('a message sent!');
      const user = users.getUser(receiverId);
      if (user)
        io.to(user.socketId).emit('getMessage', {
          senderId,
          text,
        });
    });

    //when disconnect
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
      users.removeUser(socket.id);
      io.emit('getUsers', users.get());
    });
  });
};

export default socket;
