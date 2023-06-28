//importing product model
const User=require("../models/userModel");
//importing error handler
const ErrorHandler = require("../utils/errorhandler");
const sendToken=require("../utils/JWTToken");
const sendEmail=require("../utils/sendEmail.js");
const crypto=require("crypto");
const cloudinary=require("cloudinary");

// Register a user
exports.registeruser = async(req,res,next)=>{
    // importing cloudinary images
    let myCloud;
    try {
        myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop:"scale",
        });
    } catch (err) {
        console.log("trigger ", err)
    }



    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id : myCloud.public_id,
            url : myCloud.secure_url,
        }
    });


    sendToken(user,201,res);
}

// Login user
exports.loginUser = async(req,res,next)=>{
    const{email,password}=req.body;
    //check id user has given both email and password
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",400));
    }
    // yaha hamne password direct nhi likha kyuki schema me password select false h.
    const user =await User.findOne({email:email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const ispasswordmatched =await user.comparePassword(password);
    if(!ispasswordmatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    // const token=user.getJWTToken();

    // res.status(200).json({
    //     success:true,
    //     token
    // });

    sendToken(user,200,res);
}

// Logout user
exports.logout=async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),//expires now
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"Logged out",
    })
}


// Forgot password
exports.forgotPassword = async(req,res,next)=>{
    //finding user
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //get resetpassword token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `your temp password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

    try{

        await sendEmail({
           email:user.email,
           subject:`Ecommerce Password Recovery`,
           message,
        });
        res.status(200).json({
            success:true,
            message:"email sent",
        })

    }catch(error){
        user.resetpasswordtoken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
        
    }

}
    

// reset password
exports.resetPassword = async(req,res,next)=>{

    //creating token hash
    const resetpasswordtoken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    //search user
    const user = await User.findOne({
        resetpasswordtoken,
        resetPasswordExpire:{$gt: Date.now()},//expire time aaj se jyada hona chaiye
    })

    //if user not found
    if(!user){
        return next(new ErrorHandler("reset password token is invalid.",400));
    }

    //if pass and confirm pass dont match
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("password does not match",400));
    }

    //changing user password
    user.password= req.body.password;
    user.resetpasswordtoken=undefined;
    user.resetPasswordExpire=undefined;


    await user.save();
    sendToken(user,200,res);
}



// get User Details
exports.getuserDetails = async(req,res,next)=>{
    
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    })
}


//update user password
exports.updatePassword = async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const ispasswordmatched =await user.comparePassword(req.body.oldPassword);
    if(!ispasswordmatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password don't match",400));
    }

    user.password=req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
}


// UPdate user profile
exports.updateuserProfile = async(req,res,next)=>{
    
    const newUserdata={
        name:req.body.name,
        email:req.body.email,
    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserdata.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    //(loging user,new data)replace
    const user =await  User.findByIdAndUpdate(req.user.id,newUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });



   res.status(200).json({
    success:true,
   })
}

// admin find how many users present(get all users).
exports.getAllUsers = async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
}


// get single user (admin)
exports.getsingleUser= async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with ID :${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user
    })
}


//update user role(user or admin)
exports.updateUSerRole = async(req,res,next)=>{
    const newuserdata={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,newuserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        user
    })
}


//delete user -- ADMIN
exports.deleteUser = async(req,res,next)=>{
   
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
      }

      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();


    res.status(200).json({
        success:true,
        message:"user deleted successfully"
    })
}