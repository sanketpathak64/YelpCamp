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


// EDIT comment route
router.get("/:comment_id/edit",checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit.ejs", {campground_id: req.params.id, comment: foundComment});
        }
    });
 
});


// UPDATE comment route
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    // find and update correct comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => { // req.params.comment_id - 1st parameter is the defined comment id, req.body.comment - 2nd parameter is new data
        if(err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id); // redirects to the right show page with specified id
        }
    });
});

// DESTROY comment route
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
    // deletes a comment
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) { // checks if user is logged in
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect("back");
            }
            else {
                // checks if user owns the comment
                if(foundComment.author.id.equals(req.user.id)) { // foundComment.author.id - mongoose object, req.user.id - string, .equals - mongoose function which compares object and string
                    next(); // the code that comes from route handler i.e. callback function
                }  
                else {
                    res.redirect("back");
                }
            }
        });
    }
    else {
        res.redirect("back"); // takes user back from where they came
    }
}


module.exports = router;


