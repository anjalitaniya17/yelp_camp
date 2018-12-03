var express=require("express");
var router=express.Router({mergeParams:true});
var Campgorund=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");



// ============
// comment route
//=============
//show new form for comments
router.get("/new" ,middleware.isLoggedin , function(req, res) {
     
       Campgorund.findById(req.params.id,function(err,campground){
           if(err){
               console.log(err);
           } else{
               res.render("comments/new",{campground:campground});
           }
       });
    
});

//create comment route
router.post("/",middleware.isLoggedin,function(req,res){
    
    Campgorund.findById(req.params.id,function(err, campground) {
         if(err){
             console.log(err);
         } else{
             
             Comment.create(req.body.comment,function(err,comment){
                 if(err){
                     console.log(err); 
                 } else{
                     //add username and id to comment 
                     comment.author.id=req.user._id;
                     comment.author.username=req.user.username;
                     //save comment
                     comment.save();
                   
                     
                     campground.comments.push(comment);
                     campground.save();
                     res.redirect('/campgrounds/' + campground._id);
                 }
             });
         }
    });
});
//show new edit comment form
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
  
  Comment.findById(req.params.comment_id,function(err,comment){
      if(err){
          console.log(err);
      }else{
              res.render("comments/edit",{comment:comment ,campground_id:req.params.id });
      }
      
  });
  });
  
 //update comment
 router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
     Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updated){
         if(err){
             console.log(err);
         } else{
             res.redirect("/campgrounds/" + req.params.id);
         }
     });
 });
 // delete comment
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
        } else{
             req.flash('success', 'you have successfully removed comment');
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});




module.exports=router;