const mongoose = require("mongoose");

// Schema setup
var campgroundSchema = new mongoose.Schema ({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" // name of the model
        }
    ]
});


// making into a model
var Campground = mongoose.model("Campground", campgroundSchema); // makes a model which uses the campgroundSchema

// exporting the model (we need this otherwise the file returns nothing)
module.exports = Campground;
