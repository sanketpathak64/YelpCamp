const express = require("express");
const router = express.Router({mergeParams: true}); // merge params from campgrounds and comments together to enable accessing findById


// Importing files
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");


// NEW comment route
router.get("/new", isLoggedIn, (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new.ejs", {campground: campground});
        }
    });
});


// CREATE comment route
router.post("/", isLoggedIn, (req, res) => {
    // lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    //add username and id
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    // else
    res.redirect("/login");
}


module.exports = router;


