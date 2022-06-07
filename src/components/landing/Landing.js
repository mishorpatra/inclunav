import React, { useState } from 'react';
import '../styles.css';

export default function Landing(props) {

  return (
    <div className="landing-height">
      <div className="bg-landing  container-fluid d-flex justify-content-center align-items-center h-100">
        <div className="text-white row " >
          <div className="col-lg-12 ">
            <div className="text-center" id="content">
              <img src="/inclunav/assets/images/vertical_logo.svg" alt="Welcome to Inclunav. It will assist you in Indoor Navigation and Wayfinding" className="img-fluid w-75 h-75"  />
              <h2 className="text-header font-weight-bold mt-1 mb-4" aria-hidden="true"></h2>
              <h3 className="text-normal mx-auto mb-5" aria-hidden="true">Assisted Indoor Navigation</h3>
              <button className="btn btn-landing mx-auto btn-block btn-default btn-lg font-weight-bold mt-4 h2" onClick={()=>{props.history.push('/language-select')}} > <span aria-hidden="true"> START </span> <span class="sr-only">Double tap to continue</span> </button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
