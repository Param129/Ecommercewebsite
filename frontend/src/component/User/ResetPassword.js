import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearError, resetPassword } from "../../actions/userAction";

import MetaData from "../layout/MetaData";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom"


const ResetPassword = () => {

    const history=useNavigate();
    const params=useParams();
    const dispatch = useDispatch();

    const { error, success, loading } = useSelector(
        (state) => state.forgotPassword
      );

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const resetPasswordSubmit = (e) => {
        e.preventDefault();
    
        const myForm = {
            password:password,
            confirmPassword: confirmPassword
          }
    
        dispatch(resetPassword(params.token, myForm));
      };

      useEffect(() => {
        if (error) {
          alert(error);
          dispatch(clearError());
        }
    
        if (success) {
          alert("Password Updated Successfully");
    
          history("/login");
        }
      }, [dispatch, error, history, success]);



      return (
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <MetaData title="Change Password" />
              <div className="resetPasswordContainer">
                <div className="resetPasswordBox">
                  <h2 className="resetPasswordHeading">Update Profile</h2>
    
                  <form
                    className="resetPasswordForm"
                    onSubmit={resetPasswordSubmit}
                  >
                    <div>
                      <LockOpenIcon />
                      <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="loginPassword">
                      <LockIcon />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <input
                      type="submit"
                      value="Update"
                      className="resetPasswordBtn"
                    />
                  </form>
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      );
    };
    

export default ResetPassword
