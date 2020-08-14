const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES: 'use'
if (process.env.NODE_ENV === 'development'){
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public/`)); // to serve static file.

//our own middleware: apply to every single request. Order matters!

//mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// NOTE: Order MATTERS! This needs to go after we check all other routes!
app.all('*', (req, res, next) => {
	res.status(404).json({
		status: 'fail', 
		message: `Can't find ${req.originalUrl} on this server!`
	});
	next();
});

module.exports = app;