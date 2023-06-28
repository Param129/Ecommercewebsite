const mongoose=require("mongoose");
const { isNumberObject } = require("util/types");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"], //here is name is not given then msg will be showed.
        trim:true
    },
    description:{
        type:String,
        required:[true,"Pleas enter product description"]
    },
    price:{
        type:Number,
        required:[true,"Please enter product price."],
        maxLength:[8,"Price cannot exceed 8 character"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[ // instead of object we created image array[],array of object.
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please enter product category"],

    },
    Stock:{
        type:Number,
        required:[true,"Please enter product stock"],
        maxLength:[4,"Stock can'T exceed 4 characters."],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
               type:String,
               required:true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    
    createdAt:{
        type:Date,
        default:Date.now
    }
})


// exporting the product model
module.exports = mongoose.model("Product",productSchema);