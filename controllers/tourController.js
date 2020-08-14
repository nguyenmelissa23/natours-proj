const Tour = require('./../models/tourModel');
const { query } = require('express');

const APIFeatures = require('./../utils/apiFeatures');

// class APIFeatures {
// 	constructor(query, queryString){
// 		this.query = query;
// 		this.queryString = queryString;
// 	};

// 	filter(){
// 		// 1A) Filtering
// 		const queryObj = {...this.queryString};
// 		const excludedFields = ['page', 'sort', 'limit', 'fields'];
// 		excludedFields.forEach( el => delete queryObj[el]);
// 		// 1B) Advanced Filtering
// 		let queryStr = JSON.stringify(queryObj);
// 		queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`));

// 		this.query = this.query.find(queryStr);
// 		// let query = Tour.find(queryStr);
// 		return this;
// 	}

// 	sortTours(){
// 		// 2) Sorting
// 		if (this.queryString.sort){
// 			const sortBy = this.queryString.sort.split(',').join(' ');
// 			console.log(sortBy);
// 			this.query = this.query.sort(sortBy)
// 		} else {
// 			this.query = this.query.sort('-createdAt');
// 		}
// 		return this;
// 	}

// 	limitFields(){
// 		// 3) Field Limiting 
// 		if (this.queryString.fields) {
// 			this.queryString.fields = this.queryString.fields.split(',').join(' '); 
// 			this.query = this.query.select('name duration price');
// 		} else {
// 			this.query = this.query.select('-___v'); // '-' == not selecting
// 		}
// 		return this;
// 	}

// 	paginate(){
// 		// 4) Pagination
// 		console.log(this.query.limit);
// 		const pageNum = Number(this.queryString.page) || 1;
// 		const limitNum = Number(this.queryString.limit) || 100;
// 		const skipNum = (pageNum - 1) * limitNum;
// 		console.log(limitNum)
// 		this.query = this.query.skip(skipNum).limit(limitNum);

// 		// if (this.query.page){
// 		// 	const numTours = await Tour.countDocuments();
// 		// 	if (skip >= numTours) throw new Error('This page does not exist');
// 		// }
// 		return this;
// 	}
// }

// //Middlewares
// exports.aliasTopTours = async(req, res, next) => {
// 	//Inject all info below before moving forward with the next function
// 	req.query.limit = '5';
// 	req.query.sort = '-ratingsAverage,price';
// 	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
// 	next();
// }


// 2) ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
	try {
		// EXECUTE QUERY
		const features = new APIFeatures(Tour.find(), req.query)
			.filter()
			.sortTours()
			.limitFields()
			.paginate();

		const tours = await features.query;

		// SEND RESPONSE:
		res.status(200).json({
			status: 'success', 
			result: tours.length,
			data: {
				tours
			}
		});

	} catch (err){
		res.status(404).json({
			status: 'error', 
			message: err
		})
	}
}

exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);

		res.status(200).json({
			status: 'success', 
			data: {
				tour
			}
		});
	} catch (err){
		res.status(404).json({
			status: 'error', 
			message: err
		})
	}
	
}

exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);
	res.status(201).json({
		status: 'success',
		data: {
			tour: newTour
	}})
	} catch (err){
		res.status(400).json({
			status: 'fail', 
			message: err
		})
	}
}

exports.updateTour = async (req, res) => {
	try{
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { 
			new: true, 
			runValidators: true
		});
		
		res.status(200).json({
			status: 'success', 
			data: {
				tour: tour
			}
		})
	} catch (err){
		res.status(404).json({
			status: 'fail', 
			message: err
		})
	}
}

exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: 'success', 
			data: null
		});
	} catch (err){
		res.status(404).json({
			status: 'error',
			message: err
		})
	}
}


//Middlewares
exports.aliasTopTours = async(req, res, next) => {
	//Inject all info below before moving forward with the next function
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
}




// const testTour = new Tour({
// 	name: 'The Park Camper', 
// 	price: 997
// });

// testTour
// 	.save()
// 	.then(doc => console.log(doc))
// 	.catch(err => console.log(err));