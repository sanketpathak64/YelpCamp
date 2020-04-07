const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Schema setup
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose); // adds methods from passport-local-mongoose package to userShema, which will enable easier user authentication

var User = mongoose.model("User", userSchema); // makes a model which uses the userSchema

// exporting the model (we need this otherwise the file returns nothing)
module.exports = User;