const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

// 2) ROUTE HANDLERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		status: 'success', 
		result: users.length,
		data: {
			users
		}
	});
})



exports.getUser = (req, res) => {
	const user = users.find(el => el.id == req.params.id);
	if (!user){ 	
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		})
	};
	res.status(200).json({
		status: 'success', 
		data: {
			user
		}
	});
}

exports.createUser = catchAsync( async (req, res, next) => {
	const newUser = await User.create(req.body)
	users.push(newUser);
	fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), err => {
		res.status(201).json({
			status: 'success',
			data: {
				user: newUser
			}
		})
	})
})

exports.updateUser = (req, res) => {
	const user = users.find(el => el.id == req.params.id);
	if (!user){ 	
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		})
	};
	res.status(200).json({
		status: 'success', 
		data: {
			user: '<Updating user here>...'
		}
	})
}

exports.deleteUser = (req, res) => {
	const user = users.find(el => el.id == req.params.id);
	if (!user){ 	
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		})
	};

	res.status(204).json({
		status: 'success', 
		data: null
	})
}