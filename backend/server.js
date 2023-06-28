
//importing app.js
const app=require("./app");

//importing cloudinary
const cloudinary=require("cloudinary");

// accessing config file using dotenv
const dotenv=require("dotenv");

if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:"backend/config/config.env"})
}



//handling uncaught error
//console.log(param) it gives that param is not defined this is called uncaught error.
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught  exception error")
    process.exit(1);
})

//importing and connecting to database
const connectdatabase=require("./config/database")
connectdatabase();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})



// listening on the port
const server=app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
})


//unhandled promise rejection(In config file Db connection string contain some error)
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);//after closing server exit the process
    });
});
