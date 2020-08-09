const Message = require('../models/message');

exports.getUsersHistory = async (currentUserId, otherUserId) => {
  const filter = {
    $and: [
      {
        senderId: {
          $in: [currentUserId, otherUserId]
        },
        receiverId: {
          $in: [currentUserId, otherUserId]
        }
      }
    ]
  };
  return Message.find(filter);
};

exports.markMessagesAsReaded = async (currentUserId, otherUserId) => {
  const filter = {
    $and: [
      {
        senderId: otherUserId,
        receiverId: currentUserId,
        readed: false
      }
    ]
  };
  return Message.updateMany(
    filter,
    { $set: { readed: true } },
    { multi: true }
  );
};

exports.save = message => {
  return Message.create(message);
};
