
import './App.css';

import React, { useState } from "react";

import webFont, { load } from "webfontloader";

//importing router
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';

import Header from "./component/layout/Header/Header.js";

import Footer from "./component/layout/Footer/Footer.js";

import Home from "./component/Home/Home.js";

import ProductDetails from "./component/Product/ProductDetails.js";

import Products from "./component/Product/Product.js";

import Search from "./component/Product/Search.js"

import LoginSignup from './component/User/LoginSignup';

import Profile from "./component/User/Profile.js"

import  UpdateProfile  from './component/User/UpdateProfile.js';

import UpdatePassword from "./component/User/UpdatePassword.js"

import ForgotPassword from "./component/User/ForgotPassword.js"

import ResetPassword from "./component/User/ResetPassword.js"

import Cart from "./component/Cart/Cart.js"

import Shipping from "./component/Cart/Shipping.js"

import ConfirmOrder from "./component/Cart/ConfirmOrder.js";

import Payment from "./component/Cart/Payment.js";

import OrderSuccess from "./component/Cart/OrderSuccess.js"

import MyOrders from "./component/Order/MyOrders.js"

import OrderDetails from "./component/Order/OrderDetails.js"

import Dashboard from "./component/admin/Dashboard.js"

import ProductList from "./component/admin/ProductList.js"

import NewProduct from './component/admin/NewProduct';

import UpdateProduct from "./component/admin/UpdateProduct.js"

import OrderList from "./component/admin/OrderList.js"

import ProcessOrder from "./component/admin/ProcessOrder.js";

import UsersList from "./component/admin/UsersList.js"

import UpdateUser from "./component/admin/UpdateUser.js"

import ProductReviews from "./component/admin/ProductReviews.js"

import Contact from "./component/layout/Contact/Contact"

import About from "./component/layout/About/About"


import ProtectedRoute from './component/route/ProtectedRoute';



import store from "./store";
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect } from "react";
import {Elements} from "@stripe/react-stripe-js"
import {loadStripe} from "@stripe/stripe-js"




const stripePromise = loadStripe("pk_test_51NMTtUSB2cPBh5uPTkMtf8S8IhcTrDD7xn8rmdDdikJVF0OGwcyDlN5NvDGDTlhRPvTqEAzZOFlv6yuLMhDDKmgR00TlfuSAZH");

function App() {

  //we have both isauthenticated and user in user state
  const {isAuthenticated,user}=useSelector(state=>state.user);

  const [stripeApiKey,setStripeApiKey]=useState("");

  async function getStripeApiKey(){
    const {data} =await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);

  }




  // it will apply the font we want automatic
useEffect(()=>{
  webFont.load({
    google:{
      families:["Roboto","Droid Sans","Chilanka"]
    }
  });;

  // ab main login access nhi kar sakta 
  store.dispatch(loadUser());


  // getStripeApiKey();

},[]);


window.addEventListener("contextmenu", (e) => e.preventDefault());


  return (
  <Router>

    {/* calling header */}
    <Header/>

    {/* show user profile and options */}
    {isAuthenticated && <UserOptions user={user}/>}


    {/* calling all routes */}
   <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/product/:id" element={<ProductDetails/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/products/:keyword" element={<Products/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/login" element={<LoginSignup/>}/>
          <Route path="/account" element={<Profile/>}/>
          <Route path="/me/update" element={<UpdateProfile/>}/>
          <Route path="/password/update" element={<UpdatePassword/>}/>
          <Route path="/password/forgot" element={<ForgotPassword/>}/>
          <Route path="/password/reset/:token" element={<ResetPassword/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/login/shipping" element={<Shipping/>}/>
        
          <Route path="/payment/process" element={ <Elements stripe={stripePromise}>  <Payment/></Elements> }/>
          <Route path="/success" element={<OrderSuccess/>}/>
          <Route path="/orders" element={<MyOrders/>}/>
          <Route path="/order/:id" element={<OrderDetails/>}/>
          <Route path="/order/confirm" element={<ConfirmOrder/>}/>

          <Route path="/admin/dashboard" element={<Dashboard/>}/>
          <Route path="/admin/products" element={<ProductList/>}/>
          <Route path="/admin/product" element={<NewProduct/>}/>
          <Route path="/admin/product/:id" element={<UpdateProduct/>}/>
          <Route path="/admin/orders" element={<OrderList/>}/>
          <Route path="/admin/order/:id" element={<ProcessOrder/>}/>
          <Route path="/admin/users" element={<UsersList/>}/>
          <Route path="/admin/user/:id" element={<UpdateUser/>}/>
          <Route path="/admin/reviews" element={<ProductReviews/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/about" element={<About/>}/>

          {/* <Route path="/account" element={<ProtectedRoute/>}>
            <Route path="/account" element={<Profile/>}/>
          </Route> */}
   </Routes>
    
    {/* callling footer */}
    <Footer/>

  </Router>
  );
}

export default App;
