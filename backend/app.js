const express=require("express");
 const app=express();
 app.use(express.json({limit:'50mb'}));
 const cookieparser=require("cookie-parser");
 const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload");
// accessing config file using dotenv
const dotenv=require("dotenv");


if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:"backend/config/config.env"})
}

const path=require("path");

 //importing middleware error
 const errorMiddleWare=require("./middleware/error");
app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());


// all routes import
const product=require("./routes/productRoute");
const user=require("./routes/userRoute");
const order=require("./routes/orderRoute");
const payment=require("./routes/paymentRoute")
app.use("/api/v1",user);
app.use("/api/v1",product);
app.use("/api/v1",order);
app.use("/api/v1",payment);


app.use(express.static(path.join(__dirname,"../frontend/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})
//middleware for error
app.use(errorMiddleWare);

 module.exports = app

 //admin pass=paramveersingh,
 //bala pass=passbala