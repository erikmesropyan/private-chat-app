const fs = require('fs');
const path = require('path');
const User = require('../models/user');

module.exports = async () => {
  if ((await User.find()).length === 0) {
    const data = fs.readFileSync(path.join(__dirname, 'init.json'), 'utf-8');
    await User.create(JSON.parse(data));
  }
};
