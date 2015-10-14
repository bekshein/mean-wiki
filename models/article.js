var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// defined article schema
var articleSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    category: Array,
    summary: { type: String, maxlength: 140 },
    content: { type: String, required: true },
    pastEdits: []
});

// article model
var Article = mongoose.model('Article', articleSchema);

// article model export
module.exports = Article;
