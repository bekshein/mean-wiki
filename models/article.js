var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// defined article schema
var articleSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: Date,
    category: [ String ],
    summary: { type: String, maxlength: 140 },
    content: { type: String, required: true }
});

// article model
var Article = mongoose.model('Article', articleSchema);

// article model export
module.exports = Article;
