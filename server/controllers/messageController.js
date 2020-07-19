const catchAsync = require('../utils/catchAsync');
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
}
