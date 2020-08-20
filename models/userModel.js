const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: [ true, 'Please tell us your name'],
	}, 
	email: {
		type: String, 
		require: [ true, 'Please provide your email'],
		unique: true, 
		lowercase: true, 
		validate: [validator.isEmail, 'Please provide a valid email']
	}, 
	photo: {
		type: String, 
	}, 
	password: {
		type: String, 
		required: [true, 'Pleave provide a password'],
		minlength: 8, 
		select: false 
		//not return the password to the client
	}, 
	passwordConfirm: { 
		type: String, 
		required: [true, 'Please confirm your password'], 
		validate: {
			// this only works on CREATE() and SAVE()
			validator: function(el){
				return el === this.password;
			},
			message: 'Password is not the same.'
		}
	}
});

userSchema.pre('save', async function(next){
	//only run this function if password was actually modified.
	if (!this.isModified('password')) return next();
	//bcrypt
	this.password = await bcrypt.hash(this.password, 12) //default is 10 CPU power.
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
	return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema);

module.exports = User;