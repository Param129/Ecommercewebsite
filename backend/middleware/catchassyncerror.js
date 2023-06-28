const { Promise } = require("mongoose")

module.exports = fun=>(req,res,next)=>{
    Promise.resolve(fun(req,res,next)).catch(next);
};