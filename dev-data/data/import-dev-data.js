const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const fs = require('fs');

dotenv.config({path: './config.env'});
// console.log(process.env);
const DB = process.env.DATABASE.replace(
	'<PASSWORD>', 
	process.env.DATABASE_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true, 
		useCreateIndex: true, 
		useFindAndModify: false, 
		useUnifiedTopology: true
	})
	.then( conn => { console.log('DB connected successfully');});

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async() => {
	try{
		await Tour.create(tours);
		console.log('Data successfully loaded');
		process.exit();
	} catch (err){
		console.log(err);
	}
}

//DELETE ALL DATA FROM DB
const deleteData = async() => {
	try{
		await Tour.deleteMany();
		console.log('Data successfully deleted');
		process.exit();
	} catch (err){
		console.log(err);
	}
}

if (process.argv[2] === '--import'){
	importData();
} else if (process.argv[2] === '--delete'){
	deleteData();
}


console.log(process.argv);