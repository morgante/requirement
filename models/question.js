// we need mongoose
var mongoose = require('mongoose');

var schema = mongoose.Schema({
	question: String,
	answer: String,
	posts: [mongoose.Schema.Types.ObjectId]
});

/**
 * Find a matching question for given text
 *
 * @param {Post} post The post to find a match for
 * @param {number} score The minimum matching score (0 to 1)
 * @param {function} callback Function(err, question)
 */
schema.static('findMatch', function (post, score, callback) {
	if (post.question) {
		this.findOne({_id: post.question}, function(err, question) {
			callback(err, question);
		});
	} else {
		callback(null, null);
	}
});

var Question = module.exports = mongoose.model('Question', schema);