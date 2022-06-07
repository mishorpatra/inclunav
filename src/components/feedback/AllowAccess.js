import React, { useState } from 'react';
import '../styles.css';

export default function AllowAccess(props) {

  return (
    <div className="landing-height">
    <nav className="navbar navbar-expand-lg nav-bg text-white">
        <div className="mx-auto"> REGISTRATION </div>
    </nav>
    <div className="bg-landing  container-fluid d-flex justify-content-center align-items-center h-100">
        <div className="text-white row w-100" >
        <div className="col-lg-12 ">
            <div className="text-center" id="content">
              <h3 className="access-content mx-auto mb-5" aria-hidden="true">This application uses GPS and Bluetooth for navigation and geolocation purposes. Please enable Bluetooth and GPS services to continue using this application.</h3>
              <button className="btn btn-landing mx-auto btn-block btn-default btn-lg font-weight-bold mt-4 h2" onClick={()=>{props.history.push('/language-select')}} > Enable Bluetooth and GPS </button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
