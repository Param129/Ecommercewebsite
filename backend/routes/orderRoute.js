const express=require("express");

const router=express.Router();

const { isautheticateduser,authorizeRoles} = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrder, getAllOrder, updateOrder, deleteOrder } = require("../controllers/ordercontroller");

router.route("/order/new").post(isautheticateduser,newOrder);

router.route("/order/:id").get(isautheticateduser,getSingleOrder);

router.route("/orders/me").get(isautheticateduser,myOrder);

router.route("/admin/orders").get(isautheticateduser,authorizeRoles("admin"),getAllOrder);

router.route("/admin/order/:id").put(isautheticateduser,authorizeRoles("admin"),updateOrder).delete(isautheticateduser,authorizeRoles("admin"),deleteOrder);

module.exports=router;