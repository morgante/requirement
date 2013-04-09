// we need mongoose
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	fbID: Number,
	fbPosts: {type: Number, default: 0},
	fbComments: {type: Number, default: 0}
});

var User = module.exports = mongoose.model('User', userSchema);