const mongoose = require('mongoose');
const Message = require('./message');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'username is required!']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
});

userSchema.virtual('newMessagesCount');
userSchema.pre(/^find/, function (next) {
    this.select('-__v');
    next();
});

class UserClass {
    async setNewMessagesCount(currentUser) {
        this.newMessagesCount = await Message.countDocuments({
            readed: false,
            senderId: this._id,
            receiverId: currentUser._id
        })
    }
}

userSchema.loadClass(UserClass);

userSchema.set('toJSON', {virtuals: true});
userSchema.set('toObject', {virtuals: true})


const User = mongoose.model('User', userSchema);

module.exports = User;
