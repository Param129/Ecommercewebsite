import React, { Fragment, useState,useEffect} from 'react'
import "./UpdateProfile.css";
import Loader from "../layout/loader/Loader";

import MailOutlineIcon from "@material-ui/icons/MailOutline"
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import {  updateProfile,clearError,loadUser } from "../../actions/userAction";
import {useNavigate} from "react-router-dom"
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";



const UpdateProfile = () => {

    const dispatch=useDispatch();
 
    const history=useNavigate();

     //useSelector
  const {user} = useSelector((state) => state.user);
  const {error,isUpdated,loading}=useSelector((state)=>state.profile);


  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [avatar,setAvatar]=useState("/Profile.png");
  const [avatarPreview,setAvatarPreview]=useState("/Profile.png");//taking from public folder

      // register submit gives
  const updateProfileSubmit=(e)=>{
    e.preventDefault();

    // making data from form
    const myForm = {
      name: name,
      email: email,
      avatar: avatar
    }
    
    dispatch(updateProfile(myForm));
  }

// onsubmit register form
const updateProfileDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

          //useeffect
  useEffect(() => {
    if (user) {
        setName(user.name);
        setEmail(user.email);
        setAvatarPreview(user.avatar.url);
      }

      if (error) {
        alert(error);
        dispatch(clearError());
      }

      if (isUpdated) {
        alert("Profile Updated Successfully");
        dispatch(loadUser());
  
        history("/account");
  
        dispatch({
          type: UPDATE_PROFILE_RESET,
        });
      }

  }, [dispatch, error, history, user, isUpdated]);



  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
export default UpdateProfile
