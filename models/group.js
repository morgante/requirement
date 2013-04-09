// we need mongoose
var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
	fbID: { type: Number, required: true, index: { unique: true } },
	lastParsedTime: { type: Date, default: Date.parse( '1970' ) }
});

var Group = module.exports = mongoose.model('Group', groupSchema);