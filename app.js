var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

//var seedDB=require("./seeds");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var MethodOverride=require("method-override");
var flash=require("connect-flash");

//for password reset'
var async=require("async");
var nodemailer=require("nodemailer");
var crypto=require("crypto");
//require moment
app.locals.moment = require('moment');

//seedDB();  //seed the database
 mongoose.connect("mongodb://localhost:27017/yelp_camp1");
//mongoose.connect("mongodb://anjali:nisha17@ds027483.mlab.com:27483/yelp_camp");

console.log(process.env.EMAILPASSWORD);
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());

//models configuration
var Campgorund = require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");


app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(MethodOverride("_method"));

var commentroutes=require("./routes/comments");
var campgroundroutes=require("./routes/campground");
var indexroutes=require("./routes/auth");

//passport configuration
app.use(require("express-session")({
    secret: "my mom is best",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error');
     res.locals.success=req.flash('success');
    next();
});
//main routes configuration 
app.use("/",indexroutes);
app.use("/campgrounds",campgroundroutes);
app.use("/campgrounds/:id/comments",commentroutes);


app.listen(3001,function(){
    console.log("yelp camp server has started");
})