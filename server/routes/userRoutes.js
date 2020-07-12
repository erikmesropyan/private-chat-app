const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();
router.post('/signup',
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.signup);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers)
module.exports = router;
