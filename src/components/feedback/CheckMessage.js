import React, { useState } from 'react';
import '../styles.css';

export default function Registration(props) {

  return (
    <div className="landing-height">
    <nav className="navbar navbar-expand-lg nav-bg text-white">
        <div className="mx-auto"> REGISTRATION </div>
    </nav>
    <div className="bg-landing  container-fluid d-flex justify-content-center align-items-center h-100">
        <div className="text-white row w-100" >
        <div className="col-lg-12 ">
            <div className="text-center" id="content">
              <h3 className="registration-success mx-auto mb-5" aria-hidden="true">Check SMS!</h3>
              <h3 className="access-content mx-auto mb-5" aria-hidden="true">Check SMS! A link has been sent to your registered mobile number. Please follow the instructions on the link to reset your password.</h3>
              <button className="btn btn-landing mx-auto btn-block btn-default btn-lg font-weight-bold mt-4 h2" onClick={()=>{props.history.push('/login')}} >Back to Sign In</button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}