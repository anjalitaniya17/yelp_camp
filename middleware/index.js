// all middlewares goes here
var Campgorund=require("../models/campground");
var Comment=require("../models/comment");
var middlewareobj={};

middlewareobj.checkOwnership=function(req,res,next){
     if(req.isAuthenticated()){
        Campgorund.findById(req.params.id,function(err,foundcampground){
            if(err){
                 console.log(err);
                  req.flash('error', 'you had to login todo so');
           res.redirect("back");
            }
            else{
                //does user owns a campground??
                 if(foundcampground.author.id.equals(req.user._id)){
                 next();
                }else{
                     req.flash('error', 'you had no permission to do so');
                    res.redirect("back");
                 }
               }
        });
   
     } else{
          req.flash('error', 'you had to login todo so');
        res.redirect("back");
    }
  };
  
middlewareobj.checkCommentOwnership=function(req,res,next){
     if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err){
                 console.log(err);
                 
          res.redirect("back");
            }
            else{
                //does user owns a comment??
                 if(foundcomment.author.id.equals(req.user._id)){
                 next();
                }else{
                     req.flash('error', 'you do not permission to do so');
                    res.redirect("back");
                 }
              }
        });
   
     } else{
          req.flash('error', 'you had to login todo so');
        res.redirect("back");
    }
};

middlewareobj.isLoggedin= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'you had to login todo so');
    res.redirect("/login");
};

module.exports=middlewareobj;