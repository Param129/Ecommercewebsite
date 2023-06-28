const express=require("express");
const { registeruser, loginUser, logout, forgotPassword, resetPassword, getuserDetails, updatePassword, updateuserProfile, getAllUsers, getsingleUser, updateUSerRole, deleteUser } = require("../controllers/usercontroller");

const router=express.Router();

const { isautheticateduser,authorizeRoles} = require("../middleware/auth");

// REgister a user
router.route("/register").post(registeruser);

//Login user
router.route("/login").post(loginUser);

//logout user
router.route("/logout").get(logout);

// forgot password
router.route("/password/forgot").post(forgotPassword);

//reset password
router.route("/password/reset/:token").put(resetPassword);


//get user details
router.route("/me").get(isautheticateduser,getuserDetails);

//update password
router.route("/password/update").put(isautheticateduser,updatePassword);

//update profile
router.route("/me/update").put(isautheticateduser,updateuserProfile);

router.route("/admin/users").get(isautheticateduser,authorizeRoles("admin"),getAllUsers);

router.route("/admin/user/:id").get(isautheticateduser,authorizeRoles("admin"),getsingleUser);

router.route("/admin/user/:id").put(isautheticateduser,authorizeRoles("admin"),updateUSerRole)
.delete(isautheticateduser,authorizeRoles("admin"),deleteUser);

module.exports=router;
