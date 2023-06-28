const express=require("express");
//importing these below function from productcontriller.js
const { getAllProducts,createProduct,updateProduct, deleteProduct, getProductdetails, createreview, getallreview, deletereview, getAdminProducts } = require("../controllers/prroductController");
const { isautheticateduser,authorizeRoles} = require("../middleware/auth");
const router=express.Router();

// get request to getall products
router.route("/products").get( getAllProducts);

router.route("/admin/products").get(isautheticateduser,authorizeRoles("admin"),getAdminProducts)


//post request to create product
router.route("/admin/product/new").post(isautheticateduser,createProduct)


//update request to update product
router.route("/admin/product/:id").put(isautheticateduser, updateProduct);



// delete request to delete the product
router.route("/admin/product/:id").delete(isautheticateduser, deleteProduct);


//get single product details
router.route("/product/:id").get(getProductdetails);


// create review
router.route("/review").put(isautheticateduser,createreview);

router.route("/reviews").get(getallreview).delete(isautheticateduser,deletereview);

module.exports=router