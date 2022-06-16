import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { userRegister,sendOtp } from "../../store/actions";
import '../styles.css';
import { makeStyles, Box } from '@material-ui/core';


const useStyle = makeStyles(theme => ({
      formCont: {
        border: '2px solid #36e0c2',
        borderRadius: 8,
        padding: 20,
        width: '50vw',
        [theme.breakpoints.down('md')]: {
          width: '95vw'
        },
        '@media (max-width: 415px)': {
          height: '65%'
        }
      },
      container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        paddingRight: 16,
        '@media (max-width: 415px)': {
          justifyContent: 'flex-start'
        }
      },
      landing: {
        height: '100vh',
        overflow: 'hidden'
      }
      
}))
export default function ContactSupport(props) {
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [description,  setDescription] = useState('');
    // const [otpValue,  setOtp] = useState('');
    // const [errorMsg,  setErrorMsg] = useState('');
    // const [lenErr,  setLenErr] = useState(false);
    // const [capsErr,  setCapsErr] = useState(false);
    // const [numErr,  setnNumErr] = useState(false);
    // const [otpStatus,  setOtpStatus] = useState(false);
    // const signupResponse = useSelector(state => state.userRegister);
    // const otpResponse = useSelector(state => state.sendOtp);
    // const dispatch = useDispatch();

    const classes = useStyle()

  return (
    <div className={`landing-height", ${classes.landing}`} >
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
        <div className="mx-auto"> CONTACT SUPPORT </div>
    </nav>
    <div className="bg-landing  container-fluid d-flex h-100">
    <div className="text-white row  mx-auto w-100">
            <div className="col-lg-12 mt-3">
        <div className={`text-center  pl-3 pr-3" ${classes.container}`} id="content">
                <h3 className="support-content text-justify mx-auto mb-5" aria-hidden="true">In case of any grievance or to report a problem, please fill up this form and we will contact you within 48 hours.</h3>
                <Box className={classes.formCont}>
                <div className="form-group">
                    <input type="text" className="form-control text-white text-input" id="exampleInputEmail1" placeholder="Name" value={name} onChange = {(e)=>{
                      setName(e.target.value)
                      }} />
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control text-white text-input" id="exampleInputEmail1" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if ((e.target.value === '' || re.test(e.target.value))) {
                         setMobileNumber(e.target.value)
                      } }} />
                  </div>
              <React.Fragment>
                  <div className="form-group">
                  <textarea class="form-control" id="exampleFormControlTextarea1" placeholder="description" value={description} onChange={(e)=>{setDescription(e.target.value)}} rows="3" ></textarea>
                </div>
            </React.Fragment>
                <button className="btn btn-language mx-auto btn-block btn-default btn-lg font-weight-bold mt-4 h2 mb-2" >Submit</button> 
              <hr className="login-hr" />
              <h3 className="support-content text-justify mx-auto mb-5" aria-hidden="true">Alternatively, you can call us for any product related emergency using the CONTACT button.</h3>
              </Box>
            </div>
            </div>
            </div>
      </div>
    </div>
  );
}