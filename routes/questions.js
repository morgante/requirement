var Facebook = require('facebook-node-sdk');
var User = require('../models/user');
var Group = require('../models/group');
var Post = require('../models/post');
var Question = require('../models/question');

exports.index = function( req, res ) {
	
	Question.find()
		.exec( function( err, questions ) {		
			res.render("faq", {
				title: "Room of Requirement FAQ",
				questions: questions
			});
		});
	
}