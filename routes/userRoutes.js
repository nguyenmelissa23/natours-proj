const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();
// 3) ROUTES:
router
	.post('/signup', authController.signup)
	.post('/login', authController.login)

router
	.route('/')
	.get(userController.getAllUsers)

// router
// 	.route('/:id')
// 	.get(userController.getUser)
// 	.patch(userController.updateUser)
// 	.delete(userController.deleteUser)

	module.exports = router;