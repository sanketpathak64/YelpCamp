const mongoose = require("mongoose");

// Schema setup
var commentSchema = new mongoose.Schema ({
    text: String,
    author: String
});


// making into a model
var Comment = mongoose.model("Comment", commentSchema); // makes a model which uses the commentSchema

// exporting the model (we need this otherwise the file returns nothing)
module.exports = Comment;