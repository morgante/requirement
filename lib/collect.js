var _ = require('underscore');

var User = require('../models/user');
var Group = require('../models/group');
var Post = require('../models/post');

var facebook = require('./facebook');

var collector = {
	posts: function(url, after, cb, posts) {
		if ( !posts ) {
			posts = [];
		}
		facebook.api( url, function(err, data) {
			if (data == null) {
				console.log( err );
			} else {
				posts = posts.concat( data.data );
				
				done = false;
				
				data.data.every( function( post ) {
					updated = new Date( post.updated_time );

					post.group = post.to.data[0].id;

					Post.findOne({id: post.id}, function(err, dbPost) {
						if (dbPost == null) {
							dbPost = new Post();
						}

						var finalPost = _.extend(dbPost, post);

						finalPost.save(function() {

						});
					});
				});

				if( !done && data.paging && data.paging.next ) {				
					collector.posts( data.paging.next, after, cb, posts );
				} else {
					cb( null, posts );
				}
			}
		});
	},

	group: function(group) {
		var after = false;
		var url = '/' + group.fbID + '/feed?limit=25';

	
		Post.findOne({}).sort( { updated_time: -1 } ).exec( function( err, post ) {
			if (post) {
				url += '&since=' + Math.floor( post.updated_time.getTime() / 1000);
			}
			console.log(url);

			collector.posts(url, false, function(err, posts) {
				// console.log('d', err, posts);
			});
		});
	},

	userPhoto: function(user, cb) {
		if (user.photo == undefined) {
			facebook.api( '/' + user.fbID + '?fields=name,picture', function( err, data ) {
				user.name = data.name;
				user.photo = data.picture.data.url;

				cb(err, user);
			});
		} else {
			cb(null, user);
		}
	},

	users: function() {
		User.find({}, function( err, users ) {
			users.forEach( function( usr ) {
				collector.userPhoto(usr, function(err, usr) {
					usr.posts = _.uniq(usr.posts);
					usr.fbPosts = usr.posts.length;

					usr.comments = _.uniq(usr.comments);
					usr.fbComments = usr.comments.length;

					usr.save(function() {});
				});
			});
		});
	},

	all: function() {
		Group.find({}, function(err, groups) {
			groups.forEach(collector.group);
		});

		collector.users();

		// run the collector again every minute
		setTimeout(collector.all, 1000 * 60 * 1);
	}

};

module.exports = collector;