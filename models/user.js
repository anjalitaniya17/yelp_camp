var mongoose=require("mongoose");
var PassportLocalMongoose=require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
    username:{type:String,unique:true,required:true},
    email:{type:String,unique:true,required:true},
    password: String,
    resetsswordToken:String,
    resetPasswordExpires:Date
    });
    
    // UserSchema.methods.validPassword = function( pwd ) {
    // // EXAMPLE CODE!
    // return ( this.password === pwd ); 
    // }
    
    UserSchema.plugin(PassportLocalMongoose);
module.exports= mongoose.model("User",UserSchema);