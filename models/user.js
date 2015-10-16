var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// defined user schema
var userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

// creates user method to be used on user routes
userSchema.statics.findOrCreateByEmail = function (params, callback) {
  this.findOne({
    email: params.email
  }, function (err, user) {
    if (err) {
      callback(err, null);
    } else if (user) {
      callback(null, user);
    } else {
      this.model.create(params, callback);
    }
  });
};

// user model
var User = mongoose.model('User', userSchema);

// user model export
module.exports = User;
