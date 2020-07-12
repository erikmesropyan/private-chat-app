const mongoose = require('mongoose');

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

userSchema.pre(/^find/, function(next) {
  this.select('-__v');
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
