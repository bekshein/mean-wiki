var mongoose = require('mongoose');

// defined comment schema
var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    date: { type: Date, default: Date.now },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' }
});

// comment model
mongoose.model('Comment', CommentSchema);
