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
              <h3 className="registration-success mx-auto mb-5" aria-hidden="true">Sign-Up successfull!</h3>
              {/* onClick={()=>{props.history.push('/access')}} */}
              <button className="btn btn-landing mx-auto btn-block btn-default btn-lg font-weight-bold mt-4 h2" onClick={()=>{props.history.push('/dashboard')}} >Proceed to Dashboard <img src="/inclunav/assets/images/vector.png" alt="move next page" /></button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}