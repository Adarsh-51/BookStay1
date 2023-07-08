const mongoose = require("mongoose");

var mongoURL =
  "mongodb+srv://adarshmahapatra2522:Adarsh%401234@cluster0.q6j8smx.mongodb.net/mern-rooms";

mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });

var connection = mongoose.connection;

connection.on("error", () => {
  console.log("Mongo DB Connection failed");
});

connection.on("connected", () => {
  console.log("Mongo DB Connection Successful");
});

module.exports = mongoose;
