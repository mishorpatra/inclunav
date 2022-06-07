import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userRegister, sendOtp, verifyOtp,sendEmailotp,verifyEmailotp } from "../../store/actions";
import "../styles.css";
import { verify } from "crypto";
import { connect } from "react-redux";

class UserRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      mobileNumber: "",
      password: "",
      otpValue: "",
      emailOtpValue:"",
      errorMsg: "",
      lenErr: false,
      capsErr: false,
      numErr: false,
      otpStatus: false,
      verifyStatus: false,
      email:"",
      emailOtpError:null,
      mobileOtpError:null,
      verifyEmailotpResponse:null,
      verifyMobileotpResponse:null,
      disableOtp:false,
      disableMobileOtp:false,
      regErr:true,
      comparePassword:""
    };
  }
  setName = val => {
    this.setState({
      name: val
    });
  };
  setMobileNumber = val => {
    this.setState({
      mobileNumber: val
    });
  };
  setPassword = val => {
    this.setState({
      password: val
    });
  };
  setOtp = val => {
    this.setState({
      otpValue: val
    });
  };
  setErrorMsg = val => {
    this.setState({
      errorMsg: val
    });
  };
  setLenErr = val => {
    this.setState({
      lenErr: val
    });
  };
  setCapsErr = val => {
    this.setState({
      lenErr: val
    });
  };
  setnNumErr = val => {
    this.setState({
      lenErr: val
    });
  };
  setOtpStatus = val => {
    this.setState({
      otpStatus: val
    });
  };
  setVerifyStatus = val => {
    this.setState({
      otpStatus: val
    });
  };
  requestSignup = ()=>{
      let {name,email,mobileNumber,lenErr,capsErr,numErr,password,verifyEmailotpResponse,verifyMobileotpResponse} = this.state;
      // verifyEmailotpResponse,
      // verifyMobileotpResponse
    if(name.length === 0){
      console.log("click1")
      this.setErrorMsg('Name is empty')
      return
    }else if((mobileNumber.length === 0 || mobileNumber.length > 10)){
      console.log("click2")
      this.setErrorMsg('Mobile number is invalid')
      return
    }else if(lenErr || numErr || capsErr){
      console.log("click3")
      this.setErrorMsg('password invalid')
      return
    }else if(verifyMobileotpResponse === null || verifyMobileotpResponse === false){
      console.log("click4")
      this.setState({
        mobileOtpError:"Inavlid Mobile OTP",
      })
      return
    }else if(verifyEmailotpResponse === null || verifyEmailotpResponse === false){
      console.log("click5")
      this.setState({
        emailOtpError:"Inavlid email OTP",
      })
      return
    }else{
      console.log("elsed6")
     this.props.userRegister({name,email,mobileNumber,password},()=>{
      console.log("elsed",this.props.signupResponse)
        
      if(this.props.signupResponse !== null){
                if(this.props.signupResponse.success === true){
                    this.props.history.push('/success')
                }else{
                    this.setErrorMsg('Already registered')
                }
            }
        })
    }
  }

  sendOtpRequest = ()=>{
    let {mobileNumber} = this.state;
    if(mobileNumber.length === 0 || mobileNumber.length > 10){
      this.setErrorMsg('Mobile number is invalid')
      return
    }else{
      this.props.sendOtp({mobileNumber},()=>{
        if(this.props.otpResponse.success === true){
            this.setOtpStatus(true)
            this.setState({
              disableMobileOtp:true
            },()=>{
              setTimeout(()=>{ this.setState({
              disableMobileOtp:false
              }) }, 30000);
            })
          }
      })
    }
  }

  verifyMobilOtp = ()=>{
    let {mobileNumber,otpValue} = this.state;
    if(otpValue.length === 0 || otpValue.length > 6){
      this.setErrorMsg('OTP is invalid')
      return
    }else{
      this.props.verifyOtp({mobileNumber,otp:otpValue},()=>{
        if(this.props.otpVerifyResponse.success === "approved"){
            this.setState({
                verifyStatus:true
            })
          }
      })
    }
  }

  validatePassword = e =>{
    const numPattern = /[0-9]/;
    if (numPattern.test(this.state.password)) {
      this.setnNumErr(false)
    } else {
      this.setnNumErr(true)
    }
    const capsPattern = /[A-Z]/;
    if (capsPattern.test(this.state.password)) {
      this.setCapsErr(false)
    } else {
      this.setCapsErr(true)
    }
    if (this.state.password.length >= 8) {
        this.setLenErr(false)
    } else {
      this.setLenErr(true)
    }
}

  render() {
    let {
      otpStatus,
      name,
      email,
      mobileNumber,
      password,
      otpValue,
      errorMsg,
      lenErr,
      capsErr,
      numErr,
      verifyStatus,
      emailOtpValue
    } = this.state;
    console.log("regerr",this.state.regErr)
    return (
      <div style={{height:"100%"}}>
        <nav className="navbar navbar-expand-lg nav-bg text-white fixed-top" >
                  <button
                    className="navbar-toggler"
                    type="button"
                    aria-label="Go back"
                    onClick={() => {
                      this.props.history.goBack()
                    }}
                  >
                      <img src="/inclunav/assets/images/back_arrow.png" alt="back button"/>
                  </button>
          <div className="mx-auto"> SIGNUP </div>
        </nav>
        <div className="bg-landing  container-fluid  h-100" style={{marginTop:"50px"}}>
          <div className="text-white row  mx-auto w-100">
            <div className="col-lg-12 mt-3">
              <div className="text-center  pl-3 pr-3" id="content">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control text-white text-input"
                    id="exampleInputEmail1"
                    placeholder="Name"
                    value={name}
                    onChange={e => {
                      this.setErrorMsg("");
                      this.setName(e.target.value);
                    }}
                  />
                </div>
                {/* EMAIL OTP */}
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control text-white text-input"
                    id="exampleInputEmail1"
                    placeholder="Email"
                    value={email}
                    onChange={e => {
                      this.setErrorMsg("");
                      this.setState({
                        email:e.target.value
                      })
                    }}
                  />
                </div>
                <button
                    className="btn btn-language  mx-auto btn-block btn-default btn-lg font-weight-bold mt-4 h2 mb-2"
                    onClick={()=>{
                      this.props.sendEmailotp({email:this.state.email},()=>{
                        this.setState({
                          disableOtp:true
                        },()=>{
                          setTimeout(()=>{ this.setState({
                          disableOtp:false
                          }) }, 30000);
                        })
                      })
                    }}
                    disabled={this.state.disableOtp}
                  >
                    {this.state.disableOtp?"Sent":"Send OTP"}
                </button>
                  <p className="text-white text-justify">
                  If you do not receive a code within 30 seconds, please press Send OTP.
                  </p>
                  {this.state.emailOtpError?<p className="text-white text-justify text-error">
                  {this.state.emailOtpError}
                  </p>:null}
                    <div className="form-group" id="container" >
                <div class="input-group">
                <input
                        type="text"
                        className="form-control text-input"
                        id="exampleInputPassword1"
                        placeholder="Enter 6 digit code"
                        value={emailOtpValue}
                        onChange={e => {
                          this.setState({
                            emailOtpValue:e.target.value,
                            emailOtpError:null,
                            verifyEmailotpResponse:null
                          })
                        }}
                        onBlur={()=>{
                          if(this.state.emailOtpValue.length === 6){
                            this.props.verifyEmailotp({email:this.state.email,otp:this.state.emailOtpValue},()=>{
                              if(this.props.verifyEmailotpResponse.success === "approved"){
                                this.setState({
                                    verifyEmailotpResponse:true
                                })
                              }else{
                                this.setState({
                                  emailOtpError:"Incorrect Code. Please retry by pressing Send OTP.",
                                  verifyEmailotpResponse:false
                              })
                              }
                            })
                          }
                        }}
                      />
                      {
                        this.state.verifyEmailotpResponse !==null? <div
                        className="show-pass"
                      >
                        {this.state.verifyEmailotpResponse === true ? (
                          <img
                            src="/inclunav/assets/images/verification_success.svg"
                            alt="hide password"
                          />
                        ) : (
                          <img
                            src="/inclunav/assets/images/verification_failed.svg"
                            alt="show password"
                          />
                        )}
                      </div>:null
                      }
                </div>
              </div>
                {/**************/}
                {/* MOBILE OTP */}
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control text-white text-input"
                    id="exampleInputEmail1"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={e => {
                      this.setErrorMsg("");
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        this.setMobileNumber(e.target.value);
                      }
                    }}
                  />
                </div>
                <button
                    className="btn btn-language  mx-auto btn-block btn-default btn-lg font-weight-bold mt-4 h2 mb-2"
                    onClick={this.sendOtpRequest}
                    disabled={this.state.disableMobileOtp}
                  >
                    {this.state.disableMobileOtp?"Sent":"Send OTP"}
                  </button>
                  <p className="text-white text-justify">
                  If you do not receive a code within 30 seconds, please press Send OTP.
                  </p>
                  {this.state.mobileOtpError?<p className="text-white text-justify text-error">
                  {this.state.mobileOtpError}
                  </p>:null}
                  <div className="form-group" id="container" >
                <div class="input-group">
                <input
                        type="text"
                        className="form-control text-input"
                        id="exampleInputPassword1"
                        placeholder="Enter 6 digit code"
                        value={otpValue}
                        onChange={e => {
                          this.setState({
                            otpValue:e.target.value,
                            mobileOtpError:null,
                            otpVerifyResponse:null
                          })
                        }}
                        onBlur={()=>{
                          if(this.state.otpValue.length === 6){
                            this.props.verifyOtp({mobileNumber:this.state.mobileNumber,otp:this.state.otpValue},()=>{
                              console.log("verify response",this.props.otpVerifyResponse)
                              if(this.props.otpVerifyResponse.success === "approved"){
                                
                                this.setState({
                                    verifyMobileotpResponse:true
                                })
                              }else{
                                this.setState({
                                  mobileOtpError:"Incorrect Code. Please retry by pressing Send OTP.",
                                  verifyMobileotpResponse:false
                              })
                              }
                            })
                          }
                        }}
                      />
                      {
                        this.state.verifyMobileotpResponse !==null? <div
                        className="show-pass"
                      >
                        {this.state.verifyMobileotpResponse === true ? (
                          <img
                            src="/inclunav/assets/images/verification_success.svg"
                            alt="hide password"
                          />
                        ) : (
                          <img
                            src="/inclunav/assets/images/verification_failed.svg"
                            alt="show password"
                          />
                        )}
                      </div>:null
                      }
                </div>
              </div>
              {/***********/}
                  <div className="form-group">
                      <input
                        type="password"
                        className="form-control text-input"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        value={password}
                        onChange={e => {
                          this.validatePassword(e);
                          this.setPassword(e.target.value);
                        }}
                        onBlur={this.validatePassword}
                      />
                    </div>
                    {password.length > 0 ? (
                      <React.Fragment>
                        <div className="col-12">
                          <p className="mb-0">Password must contain:</p>{" "}
                        </div>
                        <div className="col-12 text-center">
                          8 characters{" "}
                          {lenErr ? (
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
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control text-input"
                        id="exampleInputPassword1"
                        placeholder="Confirm Password"
                        value={this.state.comparePassword}
                        onChange={e => {
                        this.setState({
                          comparePassword:e.target.value
                        })
                        }}
                        onBlur={()=>{
                          if(this.state.password !== this.state.comparePassword){
                            this.setState({
                              compareErr:true
                            })
                          }else{
                            this.setState({
                              regErr:false
                            })
                          }
                        }}
                      />
                    </div>
                    {this.state.compareErr?<p className="text-white text-justify text-error">
                    Passwords do not match.
                  </p>:null}
                    <button
                  className="btn btn-language  mx-auto btn-block btn-default btn-lg font-weight-bold mt-4 h2"
                  onClick={this.requestSignup}
                  disabled={this.state.regErr}
                >
                  SignUp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    signupResponse: state.userRegister,
    otpResponse: state.sendOtp,
    otpVerifyResponse: state.verifyOtp,
    sendEmailotpResponse:state.sendEmailotp,
    verifyEmailotpResponse:state.verifyEmailotp
  };
};

export default connect(mapStateToProps, {
  userRegister,
  sendOtp,
  verifyOtp,
  sendEmailotp,
  verifyEmailotp
})(UserRegistration);