import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css"
import {useDispatch,useSelector} from "react-redux"
import {clearError,getProduct} from "../../actions/productAction"
import Loader from "../layout/loader/Loader"
import ProductCard from "../Home/ProductCard"
import {useParams} from "react-router-dom";
import {useAlert} from "react-alert";
import Pagination from "react-js-pagination";
import MetaData from "../layout/MetaData";

// for slider in price filtration
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/core/Slider";


// categories array
const categories=
["Action",
"Drama",
"Holy",
"Comedy",
"Biography",
"Mistry",
"Non-fiction",
"Fiction",
"laptop"]






const Products = () => {

    const params=useParams();
    const dispatch=useDispatch();
    const keyword=params.keyword;
    const alert=useAlert();

    const [currentPage,setCurrentPage]=useState(1);
    const [price,setPrice]=useState([0,25000]);
    const [category,setCategory]=useState("");
    const [ratings,setRatings]=useState(0);




    const setCurrentPageNo =(e) =>{
      setCurrentPage(e)
    }
    const priceHandler=(event,newPrice)=>{
      setPrice(newPrice);
    }




   // objects accessible by reducer that we fetch from backend
    const { products, loading, error,productCount,resultPerPage } = useSelector(
        (state) => state.products
      );


    

    useEffect(() => {
      if(error){
        alert.error(error);
        dispatch(clearError());
      }
        dispatch(getProduct(keyword,currentPage,price,category,ratings));
      }, [dispatch,keyword,currentPage,price,category,ratings,alert,error]);




  return  (
  <Fragment>
    {loading ? <Loader/> : <Fragment>
      <MetaData title="PRODUCTS --JM"/>
    <h2 className="productsHeading">Products</h2>

    <div className="products">
    {products &&
    products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
    </div>


      {/* //price filtration */}

      <div className="filterBox">
        <Typography>Price</Typography>
        <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />

            {/* // categories */}
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>


            {/* // ratings */}
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>

      </div>


 
    


    {/* // pagination */}

      {resultPerPage < productCount && (
            <div className="paginationBox">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={resultPerPage}
              totalItemsCount={productCount}
              onChange={setCurrentPageNo}
              nextPageText="Next"
              prevPageText="Prev"
              firstPageText="1st"
              lastPageText="Last"
              itemClass="page-item"
              linkClass="page-link"
              activeClass="pageItemActive"
              activeLinkClass="pageLinkActive"
            />
          </div>
      )}
        
        </Fragment>}
  </Fragment>
)};

export default Products
