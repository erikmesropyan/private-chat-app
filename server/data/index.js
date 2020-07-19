const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const Message = require('../models/message')

module.exports = async () => {
  if ((await User.find()).length === 0) {
    const data = fs.readFileSync(path.join(__dirname, 'init.json'), 'utf-8');
    await User.create(JSON.parse(data));
  }
  // const conversation = fs.readFileSync(path.join(__dirname, 'conversation.json'), 'utf-8');
  // await Message.create(JSON.parse(conversation));
};
