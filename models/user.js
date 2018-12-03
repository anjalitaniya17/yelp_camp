var mongoose=require("mongoose");
var PassportLocalMongoose=require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
    username:String,
    password: String,
    });
    
    // UserSchema.methods.validPassword = function( pwd ) {
    // // EXAMPLE CODE!
    // return ( this.password === pwd ); 
    // }
    
    UserSchema.plugin(PassportLocalMongoose);
module.exports= mongoose.model("User",UserSchema);