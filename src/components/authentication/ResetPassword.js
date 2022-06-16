import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userDetails,resetPassword } from "../../store/actions";
import '../styles.css';

export default function ResetPassword(props) {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [lenErr, setLenErr] = useState(false);
  const [capsErr, setCapsErr] = useState(false);
  const [numErr, setnNumErr] = useState(false);
  const resetResponse = useSelector(state => state.resetPassword);
  const getDetails = useSelector(state => state.userDetails);
  const dispatch = useDispatch();

/**
 * @id N1.2.1
 * @author Pankaj Singh
 * @description  Initial Rendering
 */
useEffect(() => {
  let url = window.location.href;
  let token = url.split("?")[1].split("&")[0];
  let id = url.split("?")[1].split("&")[1];
  if (!getDetails) {
    dispatch(userDetails({ id, token }));
  }
  if(getDetails){
      let name = getDetails.data.name;
      let mobileNumber = getDetails.data.mobileNumber;
      setName(name);
      setMobileNumber(mobileNumber);
    }
  return ()=>{
    if(resetResponse !== null){
      if(resetResponse.success === true){
        props.history.push('/login')
      }else{
        // setErrorMsg('Mobile number or password is incorrect. Please try again.')
      }
    }
  }
}, [dispatch,getDetails,resetResponse]);
/**
 * @id N1.2.2
 * @author Pankaj Singh
 * @description  Compare Password
*/
  const comparePassword = event => {
    if (password === confirmPassword) {
      setErrorMsg("");
    } else {
      setErrorMsg("Passwords do not match");
    }
  };
/**
 * @id N1.2.3
 * @author Pankaj Singh
 * @description  Validate Password
*/
  const validatePassword = e => {
    const numPattern = /[0-9]/;
    if (numPattern.test(password)) {
      setnNumErr(false);
    } else {
      setnNumErr(true);
    }
    const capsPattern = /[A-Z]/;
    if (capsPattern.test(password)) {
      setCapsErr(false);
    } else {
      setCapsErr(true);
    }

    if (password.length >= 8) {
      setLenErr(false);
    } else {
      setLenErr(true);
    }
  };
/**
 * @id N1.2.4
 * @author Pankaj Singh
 * @description  pass id,password,token to https://inclunav.apps.iitd.ac.in/node/wayfinding/v1/reset-password
*/
  const requestReset = () => {
    let url = window.location.href;
    let token = url.split("?")[1].split("&&")[0];
    let id = url.split("?")[1].split("&&")[1];
    if (name.length === 0) {
      setErrorMsg("Name is empty");
      return;
    } else if (mobileNumber.length === 0 || mobileNumber.length > 10) {
      setErrorMsg("Mobile number is invalid");
      return;
    } else if (lenErr || numErr || capsErr) {
      setErrorMsg("password invalid");
      return;
    } else {
      dispatch(resetPassword({ id, password, token }));
    }
  };


  return (
    <div className="landing-height">
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
        <div className="mx-auto"> SIGNUP </div>
      </nav>
      <div className="bg-landing  container-fluid  h-100">
        <div className="text-white row  mx-auto w-100">
          <div className="col-lg-12 mt-3">

            <div className="text-center  pl-3 pr-3" id="content">
              <div className="form-group row">
                <div className="col-5">
                  <label htmlFor="staticEmail" className="col-form-label">
                    Username:
                  </label>
                </div>
                <div className="col-7 font-weight-bold">
                  <label htmlFor="staticEmail" className="col-form-label">
                    {name}
                  </label>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-5">
                  <label htmlFor="staticEmail" className="col-form-label">
                    Phone No:
                  </label>
                </div>
                <div className="col-7 font-weight-bold">
                  <label htmlFor="staticEmail" className="col-form-label">
                    {mobileNumber}
                  </label>
                </div>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control text-input"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  value={password}
                  onChange={e => {
                    validatePassword(e);
                    setPassword(e.target.value);
                  }}
                  onBlur={validatePassword}
                />
              </div>
              {password.length > 0 ? (
                <React.Fragment>
                  <div className="col-12">
                    <p className="mb-0">Password must contain:</p>{" "}
                  </div>
                  <div className="col-12 text-center">
                  8 characters {lenErr ? (
                          <img
                            className="img-ml-28"
                            src="/inclunav/assets/images/subtract.png"
                            alt="error icon"
                          />
                        ) : (
                          <img
                            className="img-ml-28"
                            src="/inclunav/assets/images/success.png"
                            alt="error icon"
                          />
                        )}
                  </div>
                  <div className="col-12 text-center">
                    1 capital letter
                      {capsErr ? (
                        <img
                            className="img-ml-23"
                            src="/inclunav/assets/images/subtract.png"
                            alt="error icon"
                        />
                      ) : (
                        <img
                            className="img-ml-23"
                            src="/inclunav/assets/images/success.png"
                            alt="error icon"
                        />
                      )}
                  </div>
                  <div className="col-12 text-center mb-2">
                    1 number
                      {numErr ? (
                        <img
                        className="img-ml-37"
                          src="/inclunav/assets/images/subtract.png"
                          alt="error icon"
                        />
                      ) : (
                        <img
                        className="img-ml-37"
                          src="/inclunav/assets/images/success.png"
                          alt="error icon"
                        />
                      )}
                  </div>
                  
                </React.Fragment>
              ) : null}
              {errorMsg.length > 0 ? (
              <p className="text-danger">{errorMsg}</p>
            ) : null}
              <div className="form-group">
                <input
                  type="password"
                  className="form-control text-input"
                  id="exampleInputPassword1"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                  }}
                  onBlur={comparePassword}
                />
              </div>
              <button
                className="btn btn-language  mx-auto btn-block btn-default btn-lg font-weight-bold mt-4 h2"
                onClick={requestReset}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
