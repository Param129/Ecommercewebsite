const Order=require("../models/ordermodel");

const ErrorHandler = require("../utils/errorhandler");

const Product = require("../models/productModel");



// creating order
exports.newOrder = async(req,res,next)=>{

    // input we need
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success:true,
        order,
    })
}


// get single order
exports.getSingleOrder= async(req,res,next)=>{

    const order=await Order.findById(req.params.id).populate("user","name email");
 // jab order place hua to usme user id bhi h aur populate karke ham us user ka name/email access kar lege.
    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }

    res.status(201).json({
        success:true,
        order,
    })
}


// get logged in users order
exports.myOrder= async(req,res,next)=>{

    //us order me jo user id h use search kara h.
    const orders=await Order.find({user:req.user._id});
 


    res.status(201).json({
        success:true,
        orders,
    })
}

// get all orders  -admin
exports.getAllOrder= async(req,res,next)=>{

    const orders=await Order.find();
 
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(201).json({
        success:true,
        totalAmount,
        orders,
    })
}

// update order status  -admin
exports.updateOrder= async(req,res,next)=>{

    const order=await Order.findById(req.params.id);
 
    if(!order){
        return next(new ErrorHandler("Order not found",404));
       }

   if(order.orderStatus==="Delivered"){
    return next(new ErrorHandler("You have already delivered this product."));
   }

   //after delivery reduce item from stocks
   if(req.body.status==="Shipped"){
    order.orderItems.forEach(async (o)=>{
        await updateStock(o.product,o.quantity);
      })
   }

   order.orderStatus=req.body.status;
   
   if(req.body.status==="Delivered"){
    order.deliverAt=Date.now();
   }

   await order.save({validateBeforeSave:false});

    res.status(201).json({
        success:true,
        
    })

    async function updateStock(id,quantity){
        const product=await Product.findById(id);
        product.Stock -= quantity;
        await product.save({validateBeforeSave:false});
    }

}


// delete order --Admin
exports.deleteOrder= async(req,res,next)=>{

    const order=await Order.findById(req.params.id);
 
    if(!order){
        return next(new ErrorHandler("Order not found"));
       }

       await order.deleteOne();

    res.status(201).json({
        success:true,
    })
}