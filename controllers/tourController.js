const Tour = require('./../models/tourModel');
const { query } = require('express');


// 2) ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
	try {
		// BUILD QUERY
		// 1A) Filtering
		const queryObj = {...req.query};
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach( el => delete queryObj[el]);
		// 1B) Advanced Filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`));

		let query = Tour.find(queryStr);

		// 2) Sorting
		if (req.query.sort){
			const sortBy = req.query.sort.split(',').join(' ');
			console.log(sortBy);
			query = query.sort(sortBy)
		} else {
			query = query.sort('-createdAt');
		}
		
		// 3) Field Limiting 
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' '); 
			query = query.select('name duration price');
		} else {
			query = query.select('-___v'); // '-' == not selecting
		}

		// 4) Pagination
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 100;
		const skip = (page - 1) * limit;

		query = query.skip(skip).limit(limit);

		if (req.query.page){
			const numTours = await Tour.countDocuments();
			if (skip >= numTours) throw new Error('This page does not exist');
		}

		// EXECUTE QUERY
		// const features = new APIFeatures(Tour.find(), req.query).filter();
		const tours = await query;

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

// 		this.query.find(JSON.parse(queryStr));
// 		// let query = Tour.find(queryStr);
// 	}

// }


// const testTour = new Tour({
// 	name: 'The Park Camper', 
// 	price: 997
// });

// testTour
// 	.save()
// 	.then(doc => console.log(doc))
// 	.catch(err => console.log(err));