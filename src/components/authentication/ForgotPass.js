import React, { useState,useEffect, Component } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/actions";
import '../styles.css';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  container: {
    overflow: 'hidden',
  },
  formBx: {
    border: '2px solid #36e0c2',
    borderRadius: 8,
    width: '40vw',
    padding: 20,
    [theme.breakpoints.down("sm")]: {
      width: '90vw'
    }
  },
  gsign: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
  },
  gpic: {
    [theme.breakpoints.down('xs')]: {
      width: 30
    }
  }
}))

export default function ForgotPass(props) {
  const [mobileNumber, setButtonText] = useState('');
  const [errorMsg,  setErrorMsg] = useState('');
  const forgotPassResponse = useSelector(state => state.forgotPassword);
  const dispatch = useDispatch();
  const classes = useStyle()

  const sendLink = ()=>{
    if(mobileNumber.length ===0 || mobileNumber.length > 11){
      setErrorMsg('Invalid Mobile Number.');
      return
    }else{
      dispatch(forgotPassword({mobileNumber,mode:'manual'}))
    }
  }

  useEffect(
    () => {
        return () => {
            if(forgotPassResponse !== null){
                if(forgotPassResponse.success === true){
                  props.history.push('/check-message')
                }else{
                  setErrorMsg('Mobile number or password is incorrect. Please try again.')
                }
              }
          }
    },
    [forgotPassResponse]
  );

  return (
    <div className={`landing-height ${classes.container}`}>
    <nav className="navbar navbar-expand-lg nav-bg text-white">
    <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarToggleExternalContent"
                    aria-controls="navbarToggleExternalContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={() => {
                      props.history.goBack()
                    }}
                  >
                      <img src="/inclunav/assets/images/back_arrow.png" alt="back button"/>
                  </button>
        <div className="mx-auto"> FORGOT PASSWORD </div>
    </nav>
    <div className={`bg-landing container-fluid  h-100 ${classes.component}`}>
        <div className="text-white row  mx-auto w-100" >
          <div className="col-lg-12 mt-5" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className={`text-center pl-3 pr-3 mt-5 ${classes.formBx}`} id="content">
                  <p>Please provide your registered mobile number below, and we will send you a link via sms to reset your password.</p>
                  <div className={errorMsg.length>0?"form-group":"form-group "} id="container" >
                    <div class="input-group">
                    <input type="text" className="form-control text-white text-input" aria-describedby="emailHelp" placeholder="Mobile Number" pattern="[0-9]" value={mobileNumber} onChange={(e) => {
                     const re = /^[0-9\b]+$/;
                     if ((e.target.value === '' || re.test(e.target.value)) && mobileNumber.length <= 10) {
                        setButtonText(e.target.value)
                     } }} />
                    </div>
                </div>
                {errorMsg.length > 0?<p className='text-error'>{errorMsg}</p>:null}
              <button className="btn btn-language mx-auto btn-block btn-default btn-lg font-weight-bold h2" 
              onClick={sendLink}
              >Send Link  <span class="sr-only">Double tap to continue</span></button> 
              <h3 className="forgot-pass mx-auto mt-4 mb-4 h-0" aria-hidden="true">Forgot Password</h3>
              <hr className="login-hr" />
              <div className="row d-flex justify-content-center align-items-center mt-0">
                    <div className="col-6 pr-2">
                        <button className="btn btn-language  mx-auto btn-block btn-default btn-lg font-weight-bold mt-0 h2" onClick={()=>{props.history.push('/register')}} >Sign-Up  <span class="sr-only">Double tap to continue</span></button> 
                    </div>
                    <div className="col-6 pl-2">
                        <button className={`btn btn-language  mx-auto btn-block btn-default btn-lg font-weight-bold mt-0 h2 ${classes.gsign}`} onClick={()=>{props.history.push('/language-select')}} ><img src="/inclunav/assets/images/google.png" alt="Sign Up with google" className={classes.gpic} /></button> 
                    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}