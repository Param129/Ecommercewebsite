import React, { Fragment, useEffect } from 'react';

import "./Home.css";

import {TbArrowBigUpLineFilled} from "react-icons/tb";

import ProductCard from "./ProductCard";

import MetaData from"../layout/MetaData";

import {clearError, getProduct} from "../../actions/productAction";

import {useSelector,useDispatch} from "react-redux";

import Loader from '../layout/loader/Loader';

import {useAlert} from "react-alert";


//temporary product object
// const product={
//     name:"Ramayana",
//     images:[{url:"https://i.ibb.co/DRST11n/1.webp"}],
//     price:2000,
//     _id:"param",
// }

const Home = () => {

  const alert=useAlert();
  const dispatch=useDispatch();
  const {loading,error,products} =useSelector(state=>state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (

     <Fragment>

      {loading ? <Loader/>:  (<Fragment>

<MetaData title=" JM Store"/>


  
<div className="banner">
<p>Welcome to JM Store</p>
<h1>FIND AMAZING BOOKS BELOW</h1>
{/* container link given on button */}
<a href="#container">
    <button>
      {/* adding icong here to button */}
    Visit Us <TbArrowBigUpLineFilled/> 
    </button>
</a>
</div>

<h2 className='homeHeading'>Featured Books</h2>

<div className="container" id='container'>

{products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
</div>

</Fragment>)};

     </Fragment>
    
  );
};

export default Home
