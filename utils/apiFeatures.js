class APIFeatures {
	constructor(query, queryString){
		this.query = query;
		this.queryString = queryString;
	};

	filter(){
		// 1A) Filtering
		const queryObj = {...this.queryString};
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach( el => delete queryObj[el]);
		// 1B) Advanced Filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`));

		this.query = this.query.find(queryStr);
		// let query = Tour.find(queryStr);
		return this;
	}

	sortTours(){
		// 2) Sorting
		if (this.queryString.sort){
			const sortBy = this.queryString.sort.split(',').join(' ');
			console.log(sortBy);
			this.query = this.query.sort(sortBy)
		} else {
			this.query = this.query.sort('-createdAt');
		}
		return this;
	}

	limitFields(){
		// 3) Field Limiting 
		if (this.queryString.fields) {
			this.queryString.fields = this.queryString.fields.split(',').join(' '); 
			this.query = this.query.select('name duration price');
		} else {
			this.query = this.query.select('-___v'); // '-' == not selecting
		}
		return this;
	}

	paginate(){
		// 4) Pagination
		const pageNum = Number(this.queryString.page) || 1;
		const limitNum = Number(this.queryString.limit) || 100;
		const skipNum = (pageNum - 1) * limitNum;

		this.query = this.query.skip(skipNum).limit(limitNum);

		// if (this.query.page){
		// 	const numTours = await Tour.countDocuments();
		// 	if (skip >= numTours) throw new Error('This page does not exist');
		// }
		return this;
	}
}

module.exports = APIFeatures;