var User = require('../models/user');

exports.lookup = function( req, res )
{	
	// db.elections.update({'name': 'NYU All-University Elections'}, {$pull: {'races': {'name': /.*Stern Undergraduate.*/}}} )
	
	name = req.query.name;
	
	User.find( {'name': { '$regex': name + '.*', $options: 'i' } }, function( err, users ) {
		res.send( users );
	});
	
}