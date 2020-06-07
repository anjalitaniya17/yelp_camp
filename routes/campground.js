var express=require("express");
var router=express.Router();
var Campgorund=require("../models/campground");
var middleware=require("../middleware");

//To get longitude and lattitude from address
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
   
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: process.env.API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

  var geocoder = NodeGeocoder(options);


var latitude=0;
var longitude=0;
var noMatch;

//campground routes 

//index route
router.get("/",function(req,res){
   // if there is any value in input search then it will show those campgrounds which mathes the fuzzy value 
    if(req.query.search)
    {
         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
          Campgorund.find({name:regex},function(err,allcampgrounds){
               if(err){
                           console.log("something went wrong with campgroung retriving");
                      }
                else  {
                        
                        if(allcampgrounds.length==0)
                        {
                            noMatch="There is no campground matched to your query, Please try again";
                            res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser:req.user,noMatch:noMatch});
                        }
                        else
                        {
                             res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser:req.user});
                        }
                         
                      }
            });
    }
    //if there is no value then it will show all campgrounds 
    else
    {
    Campgorund.find({},function(err,allcampgrounds){
        if(err){
                           console.log("something went wrong with campgroung retriving");
                       }
                       else{
                        // allcampgrounds.forEach(campground=>console.log(campground.address));
                        res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser:req.user});
                       }
    });
    }
    });
    
//new --campground form route
router.get("/new",middleware.isLoggedin,function(req, res) {
    res.render("campgrounds/new");
});

//create campground route
router.post("/",middleware.isLoggedin,function(req,res){
   var name=  req.body.name;
   var price=req.body.price;
   var image= req.body.image;
    var desc=req.body.description;
    var address=req.body.address;
    
    var author={
                   id:req.user._id,
                  username:req.user.username
    };
    
    var newcampgrounds={name:name,price:price,image:image,description:desc,address:address,author:author};
    Campgorund.create(newcampgrounds,
                        function(err,newcreated){
                            if(err){
                                
                                console.log("something went wrong with camground creation" + err);
                            } else{
                                  
                                  res.redirect("/campgrounds");
                            }
                        });
  
});

//show route
router.get("/:id" , function(req, res){
   
     Campgorund.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
         if(err){
             console.log("error from finding campground" + err);
         }
         else{
            res.render("campgrounds/show",{campground:foundCampground});
            // var result=new Promise((resolve,reject)=>{
                
            //  geocoder.geocode(foundCampground.address, function(err, res) {
            //         if(err){
            //            reject(err);
            //         }
            //           else{
                         
            //             resolve(res);
            //           }
            //     });
            // });

            // result.then((response)=>{
                
            //     res.render("campgrounds/show",{campground:foundCampground,res:response});
            // });
        }
    });
});
     
//edit campground route
router.get("/:id/edit", middleware.checkOwnership, function(req, res){

      Campgorund.findById(req.params.id,function(err,foundcampground){
           res.render("campgrounds/edit",{campground:foundcampground});
        });
        });

//update campground route
router.put("/:id",middleware.checkOwnership,function(req,res){
   Campgorund.findByIdAndUpdate(req.params.id,req.body.camp,function(err,campground){
       if(err){
           console.log(err);
       } else{
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//destroy campground route
router.delete("/:id",middleware.checkOwnership,function(req,res){
   Campgorund.findByIdAndRemove(req.params.id,function(err){
       if(err){
       console.log("it csn not be deleted");
       }else{
           res.redirect("/campgrounds");
       }
   });
});

 //function for searching query values in DB    
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;





