var User = require('../models/user');
var Group = require('../models/group');
var Post = require('../models/post');
var Question = require('../models/question');

exports.index = function( req, res ) {
	
	Post.find()
			.sort( { 'created_time': 'desc'} )
			.where('processed').ne(true)
			.limit( 10 )
			.exec( function( err, posts ) {
				
				// res.send('sam');
				
				Question.find().exec( function( err, questions ) {
					res.render("trainer", {
						title: "Room of Requirement Trainer",
						questions: questions,
						posts: posts
					});
				});				
			
			});
	
}

exports.create_faq = function( req, res ) {
	
	Post.findOne( { id: req.query.post }, function( err, post ) {
		Question.create( {
			question: post.message,
			last_asked: post.created_time,
			instances: [post.id],
			frequency: 1
		}, function( err, q ) {
			post.processed = true;
			post.faq = q.id;
			
			post.save( function( err ) {
				res.send( q );
			});
		})
	});
		
}

exports.assign = function( req, res ) {
	
	Post.findOne( { id: req.query.post }, function( err, post ) {
		Question.findById( req.query.question, function( err, q ) {			
			q.instances.push( post.id );
			q.last_asked = post.created_time;
			q.frequency = q.instances.length;
			
			q.save( function( err ) {
				post.processed = true;
				post.faq = q.id;

				post.save( function( err ) {
					res.send( q );
				});
			});
			
		});
	});
		
}

exports.ignore = function( req, res ) {
	
	posts = req.query.posts;
	
	Post.update( {id: { $in: posts } }, { processed: true }, {multi: true}, function( err ) {
		console.log( err );
	} );
	
	res.send( posts );
	
	// Post.findOne( { id: req.query.post }, function( err, post ) {
	// 	Question.findById( req.query.question, function( err, q ) {			
	// 		q.instances.push( post.id );
	// 		q.last_asked = post.created_time;
	// 		
	// 		q.save( function( err ) {
	// 			post.processed = true;
	// 			post.faq = q.id;
	// 
	// 			post.save( function( err ) {
	// 				res.send( q );
	// 			});
	// 		});
	// 		
	// 	});
	// });
		
}