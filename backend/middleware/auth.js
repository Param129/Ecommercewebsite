const ErrorHandler = require("../utils/errorhandler");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");

exports.isautheticateduser= async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return next(new ErrorHandler("please login to access this resource",401));
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(decodedData.id);
    next();
}

exports.authorizeRoles = (...roles)=>{
    //check karega ia array me admin h ki nhi
    return (req,res,next)=>{
        //req.user.role se db se role aaiga ki kya wo admin h(kyuki hamne func me role admin pass kiya h).agar wo user h to if condition execute hogi varna next.
        if(!roles.includes(req.user.role)){
          return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403));
        }
        next();
    };
};


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  };