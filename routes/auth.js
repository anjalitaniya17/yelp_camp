var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");


router.get("/",function(req,res){
    res.render("landing");
});

//===============//
//Auth Routes
//===============//


// show signup form
router.get("/register",function(req, res) {
    res.render("register");
});

//sign up logic route
router.post("/register",function(req, res) {
  var newUser=new User({username:req.body.username});
   
   User.register(newUser,req.body.password,function(err,user){
       if(err){
           //console.log(err);
           req.flash('error', err.message);
           return res.render("register");
       } 
      
           passport.authenticate("local")(req,res,function(){
                req.flash('success', 'welcome to yelpcamp'+" " +user.username);
               res.redirect("/campgrounds");
           });
        });
     });

//login route

//show login form 
router.get("/login",function(req, res) {
    res.render("login");
});
//login  route
router.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login", 
    failureFlash: true,
}) ,function(req,res){
    });

//logput route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","logged you out");
    res.redirect("/campgrounds");
});



module.exports=router;
