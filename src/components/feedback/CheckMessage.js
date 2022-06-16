import React, { useState } from 'react';
import '../styles.css';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  component: {
    overflow: 'hidden'
  },
  container: {
    border: '1px solid #36e0c2',
    borderRadius: 8,
    padding: 20,
    width: '50vw',
    [theme.breakpoints.down('sm')]: {
      width: '90vw'
    }
  }
}))
export default function Registration(props) {

  const classes = useStyle()

  return (
    <div className={`landing-height ${classes.component}`}>
    <nav className="navbar navbar-expand-lg nav-bg text-white">
        <div className="mx-auto"> REGISTRATION </div>
    </nav>
    <div className={`bg-landing  container-fluid d-flex justify-content-center align-items-center h-100 `}>
        <div className="text-white row w-100" >
        <div className="col-lg-12 " style={{display: 'flex', justifyContent: 'center'}}>
            <div className={`text-center ${classes.container}`} id="content">
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