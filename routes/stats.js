var Facebook = require('facebook-node-sdk');
var User = require('../models/user');
var Group = require('../models/group');
var Post = require('../models/post');

var facebook = new Facebook({ appID: process.env.FACEBOOK_APP, secret: process.env.FACEBOOK_SECRET });

facebook.setAccessToken( process.env.FACEBOOK_TOKEN );

function fetchPosts( url, after, cb, posts )
{
	if( !posts )
	{
		posts = [];
	}
		
	facebook.api( url, function(err, data) {
		if( data == null )
		{
			console.log( err );
		}
		else
		{
			// console.log(data); // => { id: ... }
			posts = posts.concat( data.data );
			
			done = false;
			
			data.data.every( function( post ) {
				updated = new Date( post.updated_time );
				
				// console.log( post.id );
				if( after && updated <= after )
				{
					done = true;
					return false;
				}
				else
				{
					Post.findOneAndUpdate({ id: post.id }, post, {upsert: true}, function() {} );
				}
								
				// Post.create( post, function() {} );
			});

			if( !done && data.paging && data.paging.next )
			{				
				fetchPosts( data.paging.next, after, cb, posts )
			}
			else
			{
				cb( null );
			}
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

exports.update = function( req, res ) {
	
	// Post.findOne({}).sort( { updated_time: -1 } ).exec( function( err, post ) {
	// 	if( post != null )
	// 	{
	// 		console.log( post.comments );
	// 		after = post.updated_time;
	// 	}
	// 	else
	// 	{
	// 		after = false;
	// 	}
		
	// 	fetchPosts( '/154302261314403/feed?limit=25', after, function( err ) {			
	// 		// posts.foreach( function( element ) {
	// 		// 		
	// 		// 	group.lastParsedTime = Date.parse( element.created_time );
	// 		// 
	// 		// 	User.findOneAndUpdate( { 'fbID': element.from.id }, { '$inc': { 'fbPosts': 1 } }, { 'upsert': true }, function( err ) {
	// 		// 		
	// 		// 	} );
	// 		// 		
	// 		// 	if( element.comments != undefined )
	// 		// 	{
	// 		// 		element.comments.data.forEach( function( cmt ) {
	// 		// 			User.findOneAndUpdate( { 'fbID': cmt.from.id }, { '$inc': { 'fbComments': 1 } }, { 'upsert': true }, function( err ) {
	// 		// 		
	// 		// 			} );
	// 		// 		});
	// 		// 	}
	// 		// });
					
	// 			// group.save( function() {} );
	// 	} );
	// });
	

		
	res.send( 'bob' );
	
	// ROR: 154302261314403
		
	// Group.create( { 'fbID': 154302261314403, 'lastParsedTime': 1364849754 }, function() {} );
		
	// Group.findOne( { 'fbID': 154302261314403 }, function( err, group ) {
		// group.lastParsedTime = Date.parse( '2013-04-08T18:42:28+0000' );
		// group.save( function() { }	);
		
		// console.log( '/' + group.fbID + '/feed?limit=25&since=' + ( group.lastParsedTime.getTime() / 1000) );
						
		// fetchPosts( '/' + group.fbID + '/feed?limit=25&since=' + ( group.lastParsedTime.getTime() / 1000), function( posts ) {
				// console.log( posts );
				
		// 		posts.foreach( function( element ) {
		// 				
		// 				group.lastParsedTime = Date.parse( element.created_time );
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
		// 			
		// 		group.save( function() {} );
		// // } );
				
	// });
}

exports.index = function( req, res ) {
	
	// fillUsers();
	
	User.find({})
			.sort( { 'fbPosts': 'desc' } )
			.limit(10)
			.exec( function( err, requesters ) {
																				
				User.find({})
						.sort( { 'fbComments': 'desc' } )
						.limit(10)
						.exec( function( err, commentors ) {
							
							// Post.findOne({}, function( err, post ) {
							// 	console.log( post );
							// });
							
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