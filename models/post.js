// we need mongoose
var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	message: String,
	id: String,
	from: mongoose.Schema.Types.Mixed,
	to: mongoose.Schema.Types.Mixed,
	type: String,
	created_time: Date,
	updated_time: Date,
	comments: mongoose.Schema.Types.Mixed,
	processed: {type: Boolean, default: false},
	faq: {type: mongoose.Schema.Types.Mixed, default: null}
});

var Post = module.exports = mongoose.model('Post', postSchema);