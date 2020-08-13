const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
	.then( conn => { console.log('DB connected successfully');});



// 4) START SERVER:
const app = require('./app');
const port = 8000 || process.env.PORT ;
app.listen(port, () => {
	console.log(`App running at http://localhost:${port}/ ...`)
});