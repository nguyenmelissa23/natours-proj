const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorController');

const app = express();

// NOTE: 1) MIDDLEWARES: 'use'
if (process.env.NODE_ENV === 'development'){
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public/`)); // to serve static file.

// NOTE: our own middleware: apply to every single request. Order matters!

//mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// NOTE: Order MATTERS! This needs to go after we check all other routes!
app.all('*', (req, res, next) => {
	if (req.originalUrl == '/') {
		res.status(200).json({
			message: `No defined route at http://localhost:8000/. Please visit http://localhost:8000/api/v1/tours or http://localhost:8000/api/v1/users`
		})
	}
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
//NOTE: whenever we pass something in the next() function, it would know that it is an error and skips all the other middlewares and go to the error handling middleware.

// NOTE: ERROR HANDLING MIDDLEWARE
app.use(GlobalErrorHandler);


module.exports = app;