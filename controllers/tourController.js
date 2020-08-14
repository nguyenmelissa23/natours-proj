const Tour = require('./../models/tourModel');
const { query } = require('express');

const APIFeatures = require('./../utils/apiFeatures');

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

// Aggregation Pipeline
exports.getTourStats = async (req, res) => {
	try {
		// Each document will go through this pipeline.
		const stats = await Tour.aggregate([
			{
				$match: { ratingsAverage: { $gte: 4.5}}
			}, 
			{
				$group: {
					//group them by difficulty:
					_id: { $toUpper: '$difficulty'},
					avgRating: { $avg: '$ratingsAverage'}, 
					numTours: { $sum: 1},
					numRating: { $sum: '$ratingsQuantity'},
					avgPrice: { $avg: '$price' },
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' }
				}
			}, 
			{
				$sort: { avgPrice : 1 }
			}
			// , 
			// {
			// 	$match: { _id: { $ne: 'EASY' }}
			// }
		]);
		res.status(200).json({
			status: 'success', 
			data: {
				stats: stats
			}
		})
	} catch (err) {
		res.status(404).json({
			status: 'error', 
			message: err
		})
	}
}


exports.getMonthlyPlan = async (req, res) => {
	try {
		const year = Number(req.params.year);

		const plan = await Tour.aggregate([
			{
				$unwind: '$startDates'
				// have separate documents for each of the startDates
			}, 
			{
				$match: {
					startDates:  {
						$gte: new Date(`${year}-01-01`), 
						$lte: new Date(`${year}-12-31`)
					}
				}
			},
			{
				$group: {
					_id: { $month: '$startDates'},
					numTourStarts: { $sum: 1 }, 
					tours: { $push: '$name' }
				}
			},
			{
				$addFields: { month: '$_id' }
			}, 
			{
				$project: {
					_id: 0
					// id no longer shows up.
				}
			},
			{
				$sort: { numTourStarts: -1}
			}, 
			{
				$limit: 12
			}
		]);
			
		res.status(200).json({
			status: 'success', 
			data: {
				plan: plan
			}
		})
	} catch (err) {
		res.status(404).json({
			status: 'error', 
			message: err
		})
	}
}