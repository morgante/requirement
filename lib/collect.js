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

	all: function() {
		Group.find({}, function(err, groups) {
			groups.forEach(collector.group);
		});

		// run the collector again every 10 minutes
		setTimeout(collector.all, 1000 * 60 * 10);
	}

};

module.exports = collector;