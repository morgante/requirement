var User = require('../models/user');

exports.search = function( req, res ) {		
	name = req.query.term;
	type = req.query.type;
	
	responses = [];
	
	if( name == undefined || name == null )
	{
		where = {};
	}
	else
	{
		where = {'name': { '$regex': name + '.*', $options: 'i' } };
	}
	
	User.find( where, function( err, users ) {
		users.forEach( function (user ) {
			if( type == 'simple' )
			{
				responses.push( user.name );
			}
			else
			{
				responses.push( {
					'value': user.name,
					'label': user.name,
					'photo': user.photo
				} );
			}
		} );
				
		res.send( responses );
	} );
	
}

exports.rank = function( req, res ) {		
	name = req.query.name;
	
	User.findOne( {'name': name }, function( err, user ) {
		if( err )
		{
			res.send( err );
		}
		else if( user == null )
		{
			// console.log( name );
			res.send( { 'error': 'Sorry, your name is strange. Check back later!' } );
		}
		else
		{
			user.getRank( function( postRank, commentRank ) {				
				res.send( user );
			});
		}
	});
}