const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const {promisify} = require('util');

const messageController = require('./messageController');
const User = require('./../models/user');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${Math.round(Math.random() * 1000)}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg', null)
        .jpeg({quality: 90})
        .toFile(`public/images/${req.file.filename}`);

    next();
});

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {

    const user = await User.create({
        username: req.body.username,
        photo: req.file.filename
    });

    await user.save();
    createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const {username} = req.body;

    if (!username) {
        return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({
        username: username
    });

    if (!user) {
        return next(new AppError(`user with username: ${username} not found`, 404))
    }

    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    req.user = currentUser;
    next();
});

exports.getCurrentUserId = async (token) => {
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user exists
    await User.findById(decoded.id);

    return decoded.id;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const currentUser = req.user;
    const users = await User.find({
        _id:
            {
                $ne: currentUser._id
            }
    });

    let promise = Promise.all(users.map(user =>
        user.setNewMessagesCount(currentUser)
    ))

    await promise;

    await res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
})

// exports.getMessageHistory = catchAsync(async (req, res, next) => {
//     const currentUser = req.user;
//     const otherUser = await User.findById(req.params.userId);
//     if (!otherUser) {
//         next(new AppError('user not found', 404))
//     }
//     const history = await messageController.getUsersHistory(currentUser._id, otherUser._id);
//     res.status(200).json({
//         status: 'success',
//         data: {
//             history
//         }
//     })
// })
exports.getMessageHistory = async (currentUSerId, otherUserId) => {
    const otherUser = await User.findById(otherUserId);
    // if (!otherUser) {
    //     next(new AppError('user not found', 404))
    // }
    return messageController.getUsersHistory(currentUSerId, otherUser._id);
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         history
    //     }
    // })
}

