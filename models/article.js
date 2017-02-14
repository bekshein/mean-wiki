var mongoose = require('mongoose');

// defined article schema
var ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    summary: { type: String, maxlength: 140 },
    content: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

// article model
mongoose.model('Article', ArticleSchema);
