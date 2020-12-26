const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
	return jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	})
}

exports.signup = catchAsync (async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm, 
		passwordChangedAt: req.body.passwordChangedAt
	});

	const token = signToken(newUser._id);

	res.status(201).json({
		status: 'success', 
		token,
		data: {
			user: newUser
		}
	})
});

exports.login = catchAsync(async (req, res, next) => {
	const {email, password} = req.body;
	// 1) check if email and password exit

	if (!email || !password){
		return next(new AppError('Please provide valid email and password', 400));
	}
	// 2) check if user exists && pwd is correct
	const user = await User.findOne({email}).select('+password');
	console.log(user);

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401))
	}
	// 3) if everything is ok, send token to client
	const token = signToken(user._id);

	res.status(200).json({
		status: 'success', 
		token
	})
})

exports.protect = catchAsync( async(req, res, next) => {
	// 1) Getting token and check if it exists
	let token;
	if (req.headers.authorization && 
		req.headers.authorization.startsWith('Bearer')){
		token = await req.headers.authorization.split(' ')[1];
	}
	// console.log(token);
	if (!token){
		return next( new AppError('You are not logged in. Please log in to continue', 401));
	}

	// 2) Verification token (make sure payload is the same)
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
	// promisify: function -> promise
	// console.log(decoded);
	
	// 3) Check if user still exists
	const freshUser = await User.findById(decoded.id);
	if (!freshUser){
		return next (new AppError('The user belonging to this token is no longer existed.', 401));	
	} 
	// 4) Check if user changed password after the token was issued. 
	freshUser.changedPasswordAfter(decoded.iat);
	if (!freshUser.changedPasswordAfter(decoded.iat)){
		return next(new AppError('User recently changed the password. Please log in again', 401));
	}
	//Granted access to Protected Route
	req.user = freshUser;
	next();
})