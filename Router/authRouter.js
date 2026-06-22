const express = require('express');
const authRouter = express.Router();

// Local Modules
const authController = require('../Controller/authController');



authRouter.get('/login', authController.getLoginPage);

authRouter.post('/login', authController.postLoginPage);

authRouter.get('/logout', authController.getLogoutPage); // Add this line for logout route

authRouter.get('/signup', authController.getSignupPage);

authRouter.post('/signup', authController.postSignupPage);



exports.authRouter = authRouter;