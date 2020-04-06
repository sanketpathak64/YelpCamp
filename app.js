var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// //SCHEMA SETUP
// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image:String,
//     description: String
// });

// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name:"Granite Hill", 
//         image: "https://farm5.staticflickr.com/4139/4946437816_0a0408ba65.jpg",
//         description: "This is a huge granite hill, not bathrooms, no water. Only beautiful granite." 
//     },function(err,campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("NEWLY CREATED CAMPGROUNDS");
//             console.log(campground);
//         }
//     });

var campgrounds = [
        {name: "Salomon Creek", image: "https://farm3.staticflickr.com/2124/2048184847_3fcaca5147.jpg"},
        {name: "Granite Hill", image: "https://farm5.staticflickr.com/4139/4946437816_0a0408ba65.jpg"},
        {name: "Mountai Goat's Rest", image: "https://farm5.staticflickr.com/4269/34114271804_7eebabbf08.jpg"}
    ];

app.get("/", function(req, res){
    res.render("landing.ejs");
});

//INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req,res){
    res.send("YOU HIT THE POST ROUTE!");
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name, image: image, description:desc};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlCreated){
        if(err){
            console.log(err);     
        }else{
             //redirect back to campground page
             res.redirect("/campgrounds");
        }    
    });
   
    
});

app.get("/campgrounds/new",function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //Find the campground provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //console.log(foundCampground);
             //render show template with that campground
             res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// =============================
// COMMENTS ROUTES
// =============================

app.get("/campgrounds/:id/comments/new", function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    //loookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+campground._id);
                }
            })
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

app.listen(3000, function(){
    console.log("The YelpCamp server has started!");    
});

