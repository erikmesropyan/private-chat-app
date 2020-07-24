const userController = require('../controllers/userController');

module.exports = (app) => {
    const io = require('socket.io')(app);
    io.on('connection', socket => {
        socket.on('joinRoom', joinToRoom(socket))

        socket.on('send message', (message) => {
            console.log(message);
            io.to('123').emit('getMessage', message);
        })
    })
}

const joinToRoom = (socket) => {
    // const currentUserId = await userController.getCurrentUser(token);
    return (token, otherUserId) => {
        socket.join('123');
    }
}
