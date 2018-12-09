var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var async=require("async");
var nodemailer=require("nodemailer");
var crypto=require("crypto");

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
  var newUser=new User({username:req.body.username,email:req.body.email});
   
   User.register(newUser,req.body.password,function(err,user){
       if(err){
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

//password reset route 

router.get("/forgot",(req,res)=>{
     res.render("forget");
});

router.post("/forgot",(req,res)=>{
     async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport( {
        service: 'Gmail',
        auth: {
          user: 'yelpcamptrial17@gmail.com',
          pass: process.env.EMAILPASSWORD
          
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'yelpcamptrial17@gmail.com',
        subject: 'yelpcamp Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
          console.log("mail sent");
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err){ return err;}
    res.redirect('/forgot');
  });
});

router.get("/reset/:token",(req,res)=>{
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    
    res.render('reset',{token:req.params.token});
    
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'yelpcamptrial17@gmail.com',
          pass: process.env.EMAILPASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'yelpcamptrial17@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' for yelcamp website has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
          console.log("mail sent");
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});


module.exports=router;
