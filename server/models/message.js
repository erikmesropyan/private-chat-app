const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String
    },
    hasFile: {
        type: Boolean,
        default: false
    },
    filePath: {
        type: String
    },
    fileExt: {
        type: String
    },
    sendDate: {
        type: Date,
        default: Date.now
    },
    readed: {
        type: Boolean,
        default: false
    }
});

messageSchema.pre(/^find/, function (next) {
    this.select('-__v');
    next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
