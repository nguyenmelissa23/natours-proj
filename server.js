const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => { 
	console.log(err.name, err.message);
	console.log('UNCAUGHT EXCEPTION: Shutting Down...');
	process.exit(1);
})

//Config for NODE
dotenv.config({path: './config.env'});
// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true, 
		useCreateIndex: true, 
		useFindAndModify: false, 
		useUnifiedTopology: true
	})
	.then( conn => { console.log('DB connected successfully')});

// 4) START SERVER:
const app = require('./app');
const port = 8000 || process.env.PORT ;
const server = app.listen(port, () => {
	console.log(`App running at http://localhost:${port}/ ...`)
});

// HANDLING PROMISE REJECTION ERRORS
process.on('unhandledRejection', err => {
	console.log(err.name, err.message);
	console.log('UNHANDLER REJECTION: Shutting Down...');
	server.close(() => {
		process.exit(1);
	})
});

//

