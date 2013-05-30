// we need mongoose
var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
	question: String,
	last_asked: Date,
	instances: Array,
	frequency: Number
});

var Question = module.exports = mongoose.model('Question', questionSchema);