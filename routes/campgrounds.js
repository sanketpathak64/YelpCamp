const express = require("express");
const router = express.Router(); // express.Router - helps to clean-up code by enabling to set prefixes on routes


// Importing files
var Campground = require("../models/campground.js");


// INDEX route - show all campgrounds
router.get("/", (req, res) => {
    // get all campgrounds from database
    Campground.find({}, (err, allCampgrounds) => { // {} finds everything
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds}); // {campgrounds: allCampgrounds} the contents of allCampgrounds is sent to campgrounds which is furthur used in index.ejs
        }
    });
});


// CREATE route - add to campground to database
router.post("/",isLoggedIn, (req, res) => {
    // getting data from the form and adding to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCamp = {name: name, image: image, description: description}
    
    // create new campground and save to database
    Campground.create(newCamp, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds"); // redirecting back to campgrounds page
        }
    });
});


// NEW route - show form to create new campground
router.get("/new",isLoggedIn, (req, res) => { // campgrounds/new will then send the data to the post route
    res.render("campgrounds/new.ejs");
});


// SHOW route - displays additional info for a specific campground
router.get("/:id", (req, res) => {
    // find campground with given ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => { // findById - finds the collection by unique ID, populate - populates the comments field, find the correct data, and stick it in comments array, exec - starts the query
        if(err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            res.render("campgrounds/show.ejs", {campground: foundCampground}); // render show.ejs with found Campground
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