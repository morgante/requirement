// we need mongoose
var mongoose = require('mongoose');
var natural = require('natural');
var _ = require('underscore');

var schema = mongoose.Schema({
	question: String,
	answer: String,
	posts: [mongoose.Schema.Types.ObjectId]
});

var stemmer = natural.PorterStemmer;

var compare = {
	simplify: function(string) {
		var stems = stemmer.tokenizeAndStem(string);
		return stems;
	},
	score: function(str1, str2) {
		stem1 = compare.simplify(str1);
		stem2 = compare.simplify(str2);

		return _.intersection(stem1, stem2).length;
	}
};

/**
 * Find a matching question for given text
 *
 * @param {Post} post The post to find a match for
 * @param {number} score The minimum matching score
 * @param {function} callback Function(err, question)
 */
schema.static('findMatch', function (post, minScore, callback) {
	if (post.question) {
		this.findOne({_id: post.question}, function(err, question) {
			callback(err, question);
		});
	} else {
		// TODO: be more efficient
		this.find({}, function(err, questions) {
			if (err) {
				callback(err, null);
			} else {
				var match = {
					score: 0,
					question: null
				};
				questions.forEach(function(question) {
					var score = compare.score(post.message, question.question);
					console.log(post.message, question.question, score, minScore);
					if (score >= minScore) {
						if (match == null || score >= match.score) {
							match = {
								score: score,
								question: question
							};
						}
					}
				});

				callback(null, match.question);
			}
		});
	}
});

var Question = module.exports = mongoose.model('Question', schema);