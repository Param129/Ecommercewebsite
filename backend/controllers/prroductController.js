//importing product model
const Product=require("../models/productModel");
//importing error handler
const ErrorHandler = require("../utils/errorhandler");

//importing Apifeatures from apifeature in utils
const ApiFeatures=require("../utils/apifeatures");
const cloudinary=require("cloudinary");






//creating product -- Admin

exports.createProduct = async(req,res,next)=>{
    let images = [];

    //only 1 image
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {//array of images
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
    });
};

//catchasyncerror matlab try catch hona chaiye par yaha bhot bada
//code ho jata to alag likh kar usko import kar diya.



// get all products
exports.getAllProducts =async(req,res,next)=>{

 

    //max product show on the page.
    const resultPerPage=5;
    const productCount=await Product.countDocuments();
// using apifeature to serch by keyword by passing (query and queryStr).
    const apiFeature=new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    // const products=await Product.find();
    const products=await apiFeature.query;
    res.status(200).json({
        success:true,
        products,
        productCount,
        resultPerPage,
    })
}


// Get All Product (Admin)
exports.getAdminProducts = async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  };

// update the products -- Admin
exports.updateProduct = async(req,res,next)=>{
    let product= await Product.findById(req.params.id);
    if(!product){
        // return res.status(500).json({
        //     success:false,
        //     message:"Product not found"
        // })
        return next(new ErrorHandler("Product not found",404));
    }

    // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false})
    res.status(200).json({
        success:true,
        product
    })
}


// delete the product -- Admin
exports.deleteProduct = async(req,res,next)=>{
    const product= await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
     // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
    await product.deleteOne();
    
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
}

//get product details
exports.getProductdetails = async(req,res,next)=>{
   
    const product= await Product.findById(req.params.id);
    if(!product){
       
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
        success:true,
        product,
      
    })
}


// create new review or update the review
exports.createreview = async(req,res,next)=>{

    const {rating,comment,productID} = req.body;

    const review={
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }

    const product = await Product.findById(productID);

    //if login id and id in the review is same
    const isReviewed = product.reviews.find(rev=>rev.user.toString()===req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });
    }
    else{
        product.reviews.push(review);
        //reviews is array in schema include(name,rating,comment)
        product.numOfReviews=product.reviews.length;
    }

    // rating will be avg of all ratings.
    let avg=0;
    product.ratings = product.reviews.forEach(rev=>{
        avg+=rev.rating
    })

    product.ratings=avg/product.reviews.length;

    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    })

}


//get all reviews of a product
exports.getallreview = async(req,res,next)=>{

    const product=await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })

}

// delete review
exports.deletereview = async(req,res,next)=>{

    const product=await Product.findById(req.query.productID);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    //all the reviews that we dont delete save here and delte remaining.
    const reviews = product.reviews.filter((rev)=> (rev) => rev._id.toString() !== req.query.id.toString());


    let avg=0;
    reviews.forEach((rev)=>{
        avg+=rev.rating
    })

    let ratings=0;
    if(reviews.length===0){
      ratings=0;
    }
    else{
      ratings=avg/reviews.length;
    }



    const numOfReviews=reviews.length;
    await Product.findByIdAndUpdate(
        req.query.productId,
        {
          reviews,
          ratings,
          numOfReviews,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

    res.status(200).json({
        success:true,
    })

}