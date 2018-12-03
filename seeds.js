var campgorund=require("./models/campground");
var Comment=require("./models/comment");

var data=[ {
               name:"Glowing Embers RV Park & Travel Centre",
               image:"http://farm9.staticflickr.com/8605/16573646931_22fc928bf9_o.jpg",
               description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy",
           },
           {
               name:"Ponderosa Campground",
               image:"https://www.campinginontario.ca/Uploads/Campgrounds/images/Standard/392Summer%20House%20Park.jpg",
               description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy",
           },
           {
               name:"Glen Rouge Campground",
               image:"https://pbs.twimg.com/media/ClLkK0MWMAAyz_l.jpg",
               description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy",
           }
     ];

// function that removes all campgrounds
function seedDB(){
    campgorund.remove({},function(err){
    if(err){
        console.log(err);
    } else {
        console.log("removed data");}
        // add a few camgrounds

//       data.forEach(function(seed){
//       campgorund.create(seed,function(err,c1){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("added campgoround");
//           // create a comment
//           Comment.create({
//                             text: "wonderful but I wish I had a car",
//                             author:"anjali",
//                           },function(err,comment){
//                               if(err){
//                                   console.log(err);
//                               } else{
//                                   c1.comments.push(comment);
//                                   c1.save();
//                                   console.log("created new comment");
//                               }
                             
//                           });
//       }
//   }); 
//   });
//     }
});
}



//add comments

module.exports=seedDB;


