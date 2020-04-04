var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/campgrounds");
// var Comment = require('./models/comment');
// var User = require('./models/user');
var seedDB = require('./seeds');
seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true,useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//schema setup v2


// Campground.create({
//     name: "salmon holla", 
//     image: "https://images.unsplash.com/photo-1542840843-3349799cded6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//     description: "this is huge granite hill"
// },function(err,campground){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Newly created campG: ");
//         console.log(campground);
//     }
// });

app.get('/',function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    
    //v1
    //res.render("campgrounds",{campgrounds});
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index",{campgrounds:allCampgrounds});
        }
    })
});

app.post("/campgrounds",function(req,res){
    //get data and add
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name,image,desc};
    Campground.create(newCampground,function(err,newlyCreated){
        if(err)
        {
         console.log(err);   
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
    //redirect
   
})


app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs")
});

//show info about 1 campground
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("show",{campground: foundCampground});
        }
    });

});

app.listen(3000,function(){
    console.log("yelp is started on port 3000");
})