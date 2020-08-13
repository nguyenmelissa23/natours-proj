const fs = require('fs');

const users = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

// 2) ROUTE HANDLERS
exports.getAllUsers = (req, res) => {
	res.status(200).json({
		status: 'success', 
		result: users.length,
		data: {
			users
		}
	});
}

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

exports.createUser = (req, res) => {
	const newId = users[tours.length - 1 ].id + 1;
	const newUser = Object.assign({id: newId}, req.body);
	tours.push(newUser);
	fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), err => {
		res.status(201).json({
			status: 'success',
			data: {
				user: newUser
			}
		})
	})
}

exports.updateUser = (req, res) => {
	const user = users.find(el => el.id == req.params.id);
	if (!tour){ 	
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		})
	};
	res.status(200).json({
		status: 'success', 
		data: {
			user: '<Updating tour here>...'
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