const fs = require('fs');
const Tour = require('./../models/tourModel');

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
	console.log(`Tour ID is: ${val}`);
	const tour = tours.find(el => el.id == req.params.id);
	if (!tour){ 	
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		})
	};
	next();
}

exports.checkBody = (req, res, next) => {
	if (!req.body.name || !req.body.price){
		return res.status(404).json({
			status: 'fail',
			message: 'Missing name or price'
		})
	};
	next();
}

// 2) ROUTE HANDLERS
exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success', 
		result: tours.length,
		data: {
			tours
		}
	});
}

exports.getTour = (req, res) => {
	const tour = tours.find(el => el.id == req.params.id);
	res.status(200).json({
		status: 'success', 
		data: {
			tour
		}
	});
}

exports.createTour = (req, res) => {
	const newId = tours[tours.length - 1 ].id + 1;
	const newTour = Object.assign({id: newId}, req.body);
	tours.push(newTour);
	fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour
			}
		})
	})
}

exports.updateTour = (req, res) => {
	const tour = tours.find(el => el.id == req.params.id);
	res.status(200).json({
		status: 'success', 
		data: {
			tour: '<Updating tour here>...'
		}
	})
}

exports.deleteTour = (req, res) => {
	res.status(204).json({
		status: 'success', 
		data: null
	})
}


// const testTour = new Tour({
// 	name: 'The Park Camper', 
// 	price: 997
// });

// testTour
// 	.save()
// 	.then(doc => console.log(doc))
// 	.catch(err => console.log(err));