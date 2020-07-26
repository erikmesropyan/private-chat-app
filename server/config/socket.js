const userController = require('../controllers/userController');

module.exports = (app) => {
    const io = require('socket.io')(app, {
        handlePreflightRequest: handleCors
    });
    io.use(authenticate);
    io.on('connection', socket => {
        socket.on('joinRoom', joinToRoom.bind(null, socket))
        socket.on('send message', sendMessage.bind(null, io, socket))
    })
}

const handleCors = (req, res, next) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
        "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
}

const getOrCreateRoom = (userId, otherUserId, socket) => {
    return socket.adapter.rooms.hasOwnProperty(userId + otherUserId) ? userId + otherUserId : otherUserId + userId;
}

const joinToRoom = async (socket, otherUserId) => {
    const userId = socket.handshake.query.currentUserId;
    const room = getOrCreateRoom(userId, otherUserId, socket);
    socket.leaveAll();
    socket.join(room);
    socket.emit('history', await userController.getMessageHistory(userId, otherUserId));
}

const sendMessage = (io, socket, message) => {
    io.to(Object.keys(socket.rooms)[0]).emit('getMessage', message);
}

const authenticate = async (socket, next) => {
    const auth = socket.handshake.headers.authorization;
    if (auth && auth.startsWith('Bearer')) {
        const token = auth.split(' ')[1];
        socket.handshake.query.currentUserId = await userController.getCurrentUserId(token);
        return next();
    }
    return next(new Error('authentication error'));
}
