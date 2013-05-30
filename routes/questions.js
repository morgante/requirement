var Facebook = require('facebook-node-sdk');
var User = require('../models/user');
var Group = require('../models/group');
var Post = require('../models/post');
var Question = require('../models/question');

exports.index = function( req, res ) {
	
	Question.find()
			.sort( { 'frequency': 'desc'} )
			.exec( function( err, questions ) {
				
				// questions.forEach( function( q ) {
				// 	q.instances.forEach( function( instance ) ) {
				// 		Post.findById( instance, function( ))
				// 		console.log( instance );
				// 	}
				// 	// console.log( q.instances );
				// });
								
				res.render("faq", {
					title: "Room of Requirement: FAQ",
					questions: questions
				});
			
			});
	
}