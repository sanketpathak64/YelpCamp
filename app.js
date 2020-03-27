var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "salman greek", image: "https://images.unsplash.com/photo-1542840843-3349799cded6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
    {name: "salman holla", image: "https://images.unsplash.com/photo-1542840843-3349799cded6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
    {name: "nusta dhur", image: "https://images.unsplash.com/photo-1542840843-3349799cded6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"}
]


app.get('/',function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    

    res.render("campgrounds",{campgrounds});
});

app.post("/campgrounds",function(req,res){
    //get data and add
    var name = req.body.name;
    var image = req.body.image;
    campgrounds.push({name,image});
    //redirect
    res.redirect("/campgrounds");
})


app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs")
});

app.listen(3000,function(){
    console.log("yelp is started on port 3000");
})