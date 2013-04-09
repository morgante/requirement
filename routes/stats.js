var Facebook = require('facebook-node-sdk');
var User = require('../models/user');
var Group = require('../models/group');
var Post = require('../models/post');

var facebook = new Facebook({ appID: process.env.FACEBOOK_APP, secret: process.env.FACEBOOK_SECRET });

facebook.setAccessToken( process.env.FACEBOOK_TOKEN );

function fetchPosts( url, cb, posts )
{
	if( !posts )
	{
		posts = [];
	}
	
	facebook.api( url, function(err, data) {
		
		// console.log( url );
		
	  // console.log(data); // => { id: ... }
		posts = posts.concat( data.data );
		
		console.log( 'parsed ' + posts.length );
		
		data.data.forEach( function( post ) {
			Post.create( post, function() {} );
		});
		
		if( data.paging && data.paging.next )
		{
			fetchPosts( data.paging.next, cb, posts )
		}
		else
		{
			cb( posts );
		}
	
	});
}

function fillUsers() {
	User.find({}, function( err, users ) {
		users.forEach( function( usr ) {
			if( usr.name == undefined )
			{
				facebook.api( '/' + usr.fbID + '?fields=name,picture', function( err, data ) {
					usr.name = data.name;
					usr.photo = data.picture.data.url;

					usr.save( function( err, usr ) {
						console.log( usr );
					} );
				});
			}
		});
	});
}

exports.index = function( req, res ) {
	
	fillUsers();
	
	User.find({})
			.sort( { 'fbPosts': 'desc' } )
			.limit(10)
			.exec( function( err, requesters ) {
																				
				User.find({})
						.sort( { 'fbComments': 'desc' } )
						.limit(10)
						.exec( function( err, commentors ) {
							
							Post.count({}, function( err, count){
							    res.render("stats", {
										title: "Room of Requirement Stats",
										requesters: requesters,
										commentors: commentors,
										totalPosts: count
									});
							})							
							
						});
			});
	
}

exports.runner = function( req, res ) {
	// ROR: 154302261314403
	
	var users = {};
	
	Group.create( { 'fbID': 154302261314403, 'lastParsedTime': 1364849754 }, function() {} );
		
	Group.findOne( { 'fbID': 154302261314403 }, function( err, group ) {				
		// fetchPosts( '/' + group.fbID + '/feed?limit=25&since=' + group.lastParsedTime.getTime(), function( posts ) {
		// 			posts.forEach( function( element ) {
		// 								
		// 				User.findOneAndUpdate( { 'fbID': element.from.id }, { '$inc': { 'fbPosts': 1 } }, { 'upsert': true }, function( err ) {
		// 
		// 				} );
		// 
		// 				if( element.comments != undefined )
		// 				{
		// 					element.comments.data.forEach( function( cmt ) {
		// 						User.findOneAndUpdate( { 'fbID': cmt.from.id }, { '$inc': { 'fbComments': 1 } }, { 'upsert': true }, function( err ) {
		// 
		// 						} );
		// 					});
		// 				}
		// 			});	
		// 		} );
		
		// Post.find({}, function( err, posts ) {
		// 	posts.forEach( function( post ) {
		// 						
		// 		User.findOneAndUpdate( { 'fbID': post.from.id }, { '$inc': { 'fbPosts': 1 } }, { 'upsert': true }, function( err ) {
		// 
		// 		} );
		// 
		// 		if( post.comments != undefined )
		// 		{
		// 			post.comments.data.forEach( function( cmt ) {
		// 				User.findOneAndUpdate( { 'fbID': cmt.from.id }, { '$inc': { 'fbComments': 1 } }, { 'upsert': true }, function( err ) {
		// 
		// 				} );
		// 			});
		// 		}
		// 	});
		// });
		
		// console.log( group );
	
	});
	
	res.send( 'sam' );
	res.send( 'bob' );
}