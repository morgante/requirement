// we need mongoose
var mongoose = require('mongoose');
var _ = require('underscore');

var Question = require('./question');
var User = require('./user');

var facebook = require('../lib/facebook');

var schema = mongoose.Schema({
	message: String,
	id: String,
	group: Number,
	from: mongoose.Schema.Types.Mixed,
	to: mongoose.Schema.Types.Mixed,
	type: String,
	created_time: Date,
	updated_time: Date,
	comments: mongoose.Schema.Types.Mixed,
	processed: {type: Boolean, default: false},
	question: {type: mongoose.Schema.Types.ObjectId, default: null}
});

schema.post('save', function (post) {
	// stats processing for posts
	User.findOneAndUpdate( { 'fbID': post.from.id },{
		'fbID': post.from.id,
		'name': post.from.name
	}, { 'upsert': true }, function( err, user ) {
		user.posts.push(post.id);
		user.posts = _.unique(user.posts);
		user.fbPosts = user.posts.length;

		user.save(function(err) {
			if (err) {
				console.log('err', err);
			}

			// stats processing for comments
			if (post.comments) {
				post.comments.data.forEach(function(comment) {
					User.findOneAndUpdate( { 'fbID': comment.from.id }, {
						'fbID': comment.from.id,
						'name': comment.from.name
					}, { 'upsert': true }, function( err, user ) {

						User.update({'fbID': comment.from.id}, {$push: {'comments': comment.id}}, function(err) {
							// console.log('error in comment array', err);
						});
					});
				});
			}
		});
	});

	// FAQ processing
	if (post.question == null && post.comments) {
		post.comments.data.forEach(function(comment) {
			var stripped = comment.message.replace(/( )?#answer/, '');
			var faq = comment.message.replace(/( )?#faq/, '');

			if (stripped != comment.message) {
				// someone tagged this as a FAQ;

				var answer;
				var update = false;
				if (stripped.length > 3) {
					// if there are more than 3 characters, assume this is the answer
					answer = stripped;

					// explicit answer means update FAQ
					update = true;
				} else {
					// else the first comment is answer
					answer = post.comments.data[0].message;
				}

				// need to insert a new question
				question = new Question({
					question: post.message,
					answer: answer,
					posts: []
				});

				// add ourselves on
				question.posts.push(post._id);
				question.posts = _.unique(question.posts);
				console.log(question.posts);
				question.save(function(err, q) {
					post.question = question._id;
					post.save(function(err, p) {

					});

					facebook.graph('/' + post.id + '/comments', 'POST', {
						message: 'That question has been added to the FAQ: ' + question.url()
					}, function(err, res) {
						if (err) {
							console.log('Error posting', err);
						}
					});
				});
			} else if (faq != comment.message) {
				var answer;
				var update = false;
				if (faq.length > 3) {
					// if there are more than 3 characters, assume this is the answer
					answer = faq;

					// explicit answer means update FAQ
					update = true;
				} else {
					// else the first comment is answer
					answer = post.comments.data[0].message;
				}

				// Try to find a matching question
				Question.findMatch(post, 1, function(err, question) {
					if (err) {
						console.log("error finding question", err);
					} else {
						if (question == null) {
							// need to insert a new question
							question = new Question({
								question: post.message,
								answer: answer,
								posts: []
							});
						} else {
							// if our answer is explicit, update it
							if (update) {
								question.answer = answer;
							}
						}

						console.log(question, answer, post.comments.data[0]);

						// add ourselves on
						question.posts.push(post._id);
						question.posts = _.unique(question.posts);
						question.save(function(err, q) {
							post.question = question._id;
							post.save(function(err, p) {

							});

							facebook.graph('/' + post.id + '/comments', 'POST', {
								message: 'That question is in the FAQ: ' + question.url()
							}, function(err, res) {
								if (err) {
									console.log('Error posting', err);
								}
							});
						});
					}
				});
			}

		});
	}
});

var Post = module.exports = mongoose.model('Post', schema);