var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// defined user schema
var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

// user model
var User = mongoose.model('User', userSchema);

// user model export
module.exports = User;
