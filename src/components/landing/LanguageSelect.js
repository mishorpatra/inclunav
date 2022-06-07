import React, { useState } from 'react';
import '../styles.css';

export default function LanguageSelect(props) {

  return (
    <div className="landing-height">
      <div className="bg-landing container-fluid d-flex justify-content-center align-items-center h-100">
        <div className="text-white row" >
          <div className="col-lg-12">
            <div className="text-center" id="language-content">
              <div className="sr-only"> Welcome to Inclunav Routes, your personal indoor navigation system </div>
               <h3 className="text-normal mx-auto mb-2"> <span aria-hidden="true" > Choose Your language </span>  <span className="sr-only">Choose your Preferred Language </span> </h3>
              <h3 className="text-normal mx-auto mb-2" aria-hidden="true" > अपनी भाषा चुिनए </h3>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="text-center" id="language-button">
              <button className="btn btn-language w-80 btn-default btn-lg font-weight-bold h2 mx-auto" onClick={()=>{props.history.push('/login')}} ><span aria-hidden="true">English</span>   <span class="sr-only">English</span></button>
              <button className="btn btn-language w-80 btn-default btn-lg font-weight-bold mt-4 h2 mx-auto" onClick={()=>{props.history.push('/login')}} ><span aria-hidden="true">हिन्दी</span>   <span class="sr-only">Hindi</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
