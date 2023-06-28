import React, { Fragment,useRef, useState,useEffect} from 'react'
import "./LoginSignup.css";
import Loader from "../layout/loader/Loader";
import {Link, useLocation} from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import {  login,register } from "../../actions/userAction";
import {useNavigate} from "react-router-dom"



const LoginSignup = () => {


    const location=useLocation();
    const dispatch=useDispatch();
 
    const history=useNavigate();


    //use to get refernce from form
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);



  const [loginEmail,setLoginEmail]=useState("");
  const [loginPassword,setLoginPassword]=useState("");


  const [avatar,setAvatar]=useState("/Profile.png");
  const [avatarPreview,setAvatarPreview]=useState("/Profile.png");//taking from public folder
  //user is a object contain all these things and setuser will set their value
  const [user,setUser]=useState({
    name:"",
    email:"",
    password:""
  });




  //useSelector
  const {loading,isAuthenticated} = useSelector((state) => state.user);


  //getting name email and pass of user
  const {name,email,password}=user;

// split the link in check out button in cart int two sections
  const redirect=location.search ? location.search.split("=")[1] : "/account"

  //useeffect
  useEffect(() => {
    if(isAuthenticated){
      history(redirect);
    }

  }, [dispatch,history,isAuthenticated,redirect]);



  // switchTabs function
  const switchTabs = (e, tab) => {
    if (tab === "login") {
        //same opposite to register
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
        //register click hote hi right me shift hoga aur neutral se hat jaiga
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      //register aa jaiga login left me chala jaiga nhi dikhega
      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  //onsubmit gives
  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  // register submit gives
  const registerSubmit=(e)=>{
    e.preventDefault();

    // making data from form
    const myForm = {
      name: name,
      email: email,
      password: password,
      avatar: avatar
    }
    
    dispatch(register(myForm));
  }

// onsubmit register form
const registerDataChange = (e) => {
  if (e.target.name === "avatar") {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  } else {
    setUser({ ...user, [e.target.name]: e.target.value });
  }
};



  return (
   <Fragment>
    {loading ? <Loader/> :  <Fragment>
        <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">


                <div>
                    <div className="login_signUp_toggle">
                        <p onClick={(e)=>switchTabs(e,"login")}>LOGIN</p>
                        <p onClick={(e)=>switchTabs(e,"register")}>REGISTER</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>

                {/* logn form starts */}
                <form  className="loginForm" ref={loginTab} onSubmit={loginSubmit}>

                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>  

                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
                </form>
                {/* login form ends */}


                {/* sign up form start */}
                <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"// to upload file 
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>

            </div>
        </div>

    </Fragment>}
   </Fragment>
  )
}

export default LoginSignup
