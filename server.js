var express = require('express'),
    PORT    = process.env.PORT || 5432,
    server  = express(),
    MONGOURI = process.env.MONGOLAB_URI,
    dbname = "some_useful_name",
    mongoose = require('monggose');

server.get('/test', function (req, res) {
  res.write("Welcome to my amazoing app");
  res.end();
});

mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function() {
  console.log("SERVER IS UP ON PORT:", PORT);
});
