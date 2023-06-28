import React from 'react'
import "./Profile.css"
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../layout/loader/Loader";
import { Link } from "react-router-dom";
import { Fragment,useEffect } from 'react';
import {useNavigate} from "react-router-dom"




const Profile = () => {

    const history=useNavigate();

    // use selector
    const { user, loading, isAuthenticated } = useSelector((state) => state.user);

    //use effect
    useEffect(() => {
        if (isAuthenticated === false) {
          history("/login");
        }
      }, [history, isAuthenticated]);





  return ( 
    <Fragment>
        {loading ? <Loader/> : <Fragment>

<MetaData title={`${user.name}`}/>
<div className="profileContainer">

        <div>
          <h1>My Profile</h1>
          <img src={user.avatar.url} alt={user.name} />
          <Link to="/me/update">Edit Profile</Link>
        </div>


        <div>
          <div>
            <h4>Full Name</h4>
            <p>{user.name}</p>
          </div>
          <div>
            <h4>Email</h4>
            <p>{user.email}</p>
          </div>
          <div>
            <h4>Role</h4>
            <p>{user.role}</p>
          </div>

          <div>
            <Link to="/orders">My Orders</Link>
            <Link to="/password/update">Change Password</Link>
          </div>
        </div>

      </div>

</Fragment>}
    </Fragment>
  )
}

export default Profile
