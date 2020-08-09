const fs = require('fs');
const path = require('path');

const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

module.exports = app => {
  const io = require('socket.io')(app, {
    handlePreflightRequest: handleCors
  });
  io.use(authenticate);
  const user_ns = io.of('/user');
  io.on('connection', socket => {
    socket.on('joinRoom', joinToRoom.bind(null, socket));
    socket.on('send message', sendMessage.bind(null, io, socket, user_ns));
    socket.on('readAllMessagesWith', readAllMessagesWith.bind(null, socket));
  });
};

const handleCors = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Origin': req.headers.origin, //or the specific origin you want to give access to,
    'Access-Control-Allow-Credentials': true
  };
  res.writeHead(200, headers);
  res.end();
};

const getOrCreateRoom = (userId, otherUserId, socket) => {
  return socket.adapter.rooms.hasOwnProperty(userId + otherUserId)
    ? userId + otherUserId
    : otherUserId + userId;
};

const joinToRoom = async (socket, otherUserId) => {
  const userId = socket.handshake.query.currentUserId;
  const room = getOrCreateRoom(userId, otherUserId, socket);
  socket.leaveAll();
  socket.join(room);
  socket.emit(
    'history',
    await userController.getMessageHistory(userId, otherUserId)
  );
};

const sendMessage = async (io, socket, user_ns, message) => {
  await processMessage(message);
  await messageController.save(message);
  io.to(Object.keys(socket.rooms)[0]).emit('getMessage', message);
  user_ns.emit(`notification${message.receiverId}`, message);
};

const authenticate = async (socket, next) => {
  const auth = socket.handshake.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    const token = auth.split(' ')[1];
    socket.handshake.query.currentUserId = await userController.getCurrentUserId(
      token
    );
    return next();
  }
  return next(new Error('authentication error'));
};

const processMessage = message => {
  return new Promise((resolve, reject) => {
    message.sendDate = new Date();
    if (message.file) {
      message.hasFile = true;
      const fileName = `${message.fileName +
        message.senderId +
        message.receiverId +
        new Date().getTime()}.${message.fileExt}`;
      const filePath = path.join(
        __dirname,
        '..',
        'public',
        'messages',
        fileName
      );
      fs.writeFile(filePath, message.file, function(err) {
        if (err) {
          reject(err);
        }
        message.file = message.fileExt = undefined;
        message.fileName = fileName;
        resolve();
      });
    } else {
      resolve();
    }
  });
};

const readAllMessagesWith = async (socket, otherUserId) => {
  const currentUserID = socket.handshake.query.currentUserId;
  await userController.markMessagesAsReaded(currentUserID, otherUserId);
};
