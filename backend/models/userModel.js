const mongoose=require("mongoose");
//validator is used to validate email ,password etc.
const validator=require("validator");

const bcrypt=require("bcryptjs");

const jwt=require("jsonwebtoken");

// for genrating password reset token
const crypto=require("crypto");



const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name cannot exceed maclength"],
        minLength:[4,"NAme should have more then 5 characters"]
    },

    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },

    password:{
        type:String,
        required:[true,"Please enter your email"],
        minLength:[8,"Password should have more then 8 characters"],
        select:false
        //select false matlab jab find() method me sare fields deta h par ab password nhi dega.
    },

    avatar: // instead of object we created image array[],array of object.
    {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
  
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },


    resetpasswordtoken:String,

    resetPasswordExpire:Date,

});

// converting password to hash
userSchema.pre("save",async function(next){

    if(! this.isModified("password")){
        next();
    }

    this.password =await bcrypt.hash(this.password,10)
})


// JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}


//compare Password
userSchema.methods.comparePassword = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)//compare entered and hashed password.
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken =async function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };


module.exports= mongoose.model("User",userSchema);