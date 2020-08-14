const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message, 
		stack: err.stack
	})
}

const sendErrorProd = (err, res) => {
	if (err.isOperational){ // Operational, trusted error: send message to client
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message, 
		})
	} else { // Programming or other unknown error: don't leak error details
		// 1) log error
		console.log('ERROR', err);
		// 2) Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong', 
		})
	}
}

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
	const message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
	console.log(message);
	return new AppError(message, 400);
}

const handleValidationError = err => {
	const errors = Object.values(err.errors).map(el => el.message)
	const message = `Invalid input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
}

module.exports =  (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	if (process.env.NODE_ENV === 'development'){
		sendErrorDev(err, res);
		console.log(err.name);
	} else if (process.env.NODE_ENV === 'production'){
		let error = {...err}; //make a copy
		if (err.name === 'CastError') error = handleCastErrorDB(error);
		if (err.code === 11000) error = handleDuplicateFieldsDB(error);
		if (err.name === 'ValidationError') error = handleValidationError(error);
		sendErrorProd(error, res);
	}
}