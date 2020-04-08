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
    var price = req.body.price;
    var description = req.body.description;
    var author={
        id: req.user._id,
        username:req.user.username

    };
    var newCamp = {name: name, image: image,price: price, description: description, author:author}
    
    // create new campground and save to database
    Campground.create(newCamp, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated);
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
// EDIT route
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit.ejs", {campground: foundCampground});
    });
});


// UPDATE route
router.put("/:id", checkCampgroundOwnership, (req, res) => {
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => { // req.params.id - 1st parameter is the defined id, req.body.campground - 2nd parameter is new data
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id); // redirects to the right show page with specified id
        }
    });
});


// DESTROY route
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
    // deletes a campground
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
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


function checkCampgroundOwnership (req, res, next)  {
    if(req.isAuthenticated()) { // checks if user is logged in
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err) {
                res.redirect("back");
            }
            else {
                // checks if user owns the campground
                if(foundCampground.author.id.equals(req.user.id)) { // foundCampground.author.id - mongoose object, req.user.id - string, .equals - mongoose function which compares object and string
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