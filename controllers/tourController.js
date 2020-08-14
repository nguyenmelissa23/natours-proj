const Tour = require('./../models/tourModel');

const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

// 2) ROUTE HANDLERS
exports.getAllTours = catchAsync(async (req, res, next) => {
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
})

exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id);

	if (!tour) {
		return next(new AppError('No tour found with that ID', 404))
	}

	res.status(200).json({
		status: 'success', 
		data: {
			tour
		}
	});
})

exports.createTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body);
	res.status(201).json({
		status: 'success',
		data: {
			tour: newTour
	}})
})

exports.updateTour = catchAsync(async (req, res, next) => {
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
})

exports.deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.id);
	if (!tour) {
		return next(new AppError('No tour found with that ID', 404))
	}
	res.status(204).json({
		status: 'success', 
		data: null
	});
})

//Middlewares
exports.aliasTopTours = async(req, res, next) => {
	//Inject all info below before moving forward with the next function
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
}

// Aggregation Pipeline
exports.getTourStats = catchAsync(async (req, res, next) => {
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
		]);
		res.status(200).json({
			status: 'success', 
			data: {
				stats: stats
			}
		})
})


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
})