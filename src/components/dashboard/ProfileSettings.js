import React from 'react';
import { getUserInformation,updateName, sendOtp, verifyOtp,updatePassword,updateMobile,updateEmail } from "../../store/actions/index";
import { connect } from "react-redux";
import userInformation from '../../store/reducers/userInformation';

 class ProfileSettings extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      newName:"",
      mobileNumber: "",
      newMobileNumber:"",
      password: "",
      oldPassword:"",
      email:"",
      newEmail:"",
      otpValue: "",
      emailOtpValue:"",
      errorMsg: "",
      lenErr: false,
      capsErr: false,
      numErr: false,
      otpStatus: false,
      verifyStatus: false,
      emailOtpError:null,
      mobileOtpError:null,
      verifyEmailotpResponse:null,
      verifyMobileotpResponse:null,
      disableOtp:false,
      disableMobileOtp:false,
      regErr:true,
      comparePassword:"",
      updateName:false,
      changeName:false,
      updatePassword:false,
      changePassword:false,
      updateMobileNumber:false,
      changeMobileNumber:false,
      updateEmail:false,
      changeEmail:false,
      click:false,
      nameChangeSuccess:false,
      passwordChangeSuccess:false,
      mobileChangeSuccess:false,
      emailChangeSuccess:false
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

  componentDidMount(){
    let token = localStorage.getItem('token');
    let id = localStorage.getItem('id');
      this.props.getUserInformation({id,token},()=>{
        let data  = this.props.userInformation;
        this.setState({
          name:data.name,
          email:data.email,
          mobileNumber:data.mobileNumber
        })
      })
  }

    confirmButton = (type)=>{
      let id = localStorage.getItem('id');
      let token = localStorage.getItem('token');
      return (<div className="row w-100">
      <div className="col-6">
      <button className="btn btn-confirm btn-confirm-text mx-auto btn-block btn-default font-weight-bold h2" onClick={()=>{
        if(type === "name"){
          this.props.updateName({mobileNumber:this.state.mobileNumber,newName:this.state.newName,id:id,token:token},()=>{
            if(this.props.nameChange.success === true){
              this.setState({
                nameChangeSuccess:true
              })
            }else{
              this.setState({
                nameChangeSuccess:false
              })
            }
          })
        }else if(type === "password"){
          this.props.updatePassword({mobileNumber:this.state.mobileNumber,oldPassword:this.state.oldPassword,password:this.state.password,id:id,token:token},()=>{
            console.log("this.props.passwordChange",this.props.passwordChange)
            if(this.props.passwordChange.success === true){
              this.setState({
                passwordChangeSuccess:true
              })
            }else{
              this.setState({
                passwordChangeSuccess:false
              })
            }
          })
        }else if(type === "mobile"){
          this.props.updateMobile({mobileNumber:this.state.mobileNumber,newMobileNumber:this.state.newMobileNumber,password:this.state.password,id:id,token:token},()=>{
            console.log("this.props.passwordChange",this.props.mobileChange)
            if(this.props.mobileChange.success === true){
              this.setState({
                mobileChangeSuccess:true
              })
            }else{
              this.setState({
                mobileChangeSuccess:false
              })
            }
          })
        }else if(type === "email"){
          this.props.updateEmail({email:this.state.email,newEmail:this.state.newEmail,password:this.state.password,id:id,token:token},()=>{
            console.log("this.props.passwordChange",this.props.emailChange)
            if(this.props.emailChange.success === true){
              this.setState({
                emailChangeSuccess:true
              })
            }else{
              this.setState({
                emailChangeSuccess:false
              })
            }
          })
        }
        }} 
      > CONFIRM CHANGE</button> 
      </div>
      <div className="col-6">
        <button className="btn btn-cancel btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2" onClick={()=>{
            this.setState({
              updateName:false,
              changeName:false,
              updatePassword:false,
              changePassword:false,
              updateMobileNumber:false,
              changeMobileNumber:false,
              updateEmail:false,
              changeEmail:false
            })
          }} 
        > CANCEL</button> 
      </div>
      </div>)
    }

    changeName = ()=>{
      if(!this.state.nameChangeSuccess){
        return (     
        <React.Fragment>
          {!this.state.changeName?<button className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default font-weight-bold h2" onClick={()=>{
          this.setState({
            changeName:true
          })
        }} 
        style={{fontFamily: "Noto Sans",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center"
        }}
        > CHANGE NAME</button>:null} 
        <hr className="hr-line" />
        {this.state.changeName?
        <React.Fragment>
        <div className="row w-100">
        <div className="form-group col-12">
                <input
                  type="text"
                  className="form-control text-white text-input"
                  aria-describedby="emailHelp"
                  placeholder="Mobile Number"
                  pattern="[0-9]"
                  value = {this.state.mobileNumber}
                  onChange={(e)=>{
                    this.setState({
                      mobileNumber:e.target.value
                    })
                  }}
                />
              </div>
        </div>
        <div className="row w-100">
        <div className="form-group col-12">
                <input
                  type="text"
                  className="form-control text-white text-input"
                  aria-describedby="emailHelp"
                  placeholder="Enter New Name"
                  value = {this.state.newName}
                  onChange={(e)=>{
                    this.setState({
                      newName:e.target.value
                    })
                  }}
                />
              </div>
      </div>
      {this.confirmButton("name")}
      </React.Fragment>:null}</React.Fragment>)}else{
        return <React.Fragment>
           <div className="d-flex-column justify-content-center" > 
            <p style={{
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: "24px",
              lineHeight: "32px",
              textAlign: "center",
              color: "#2FC8AD",
            }}>Name changed! </p>
            <p className="text-white" > The name registered with this account has been changed from {this.state.name} to {this.state.newName} </p> 
           </div>
      </React.Fragment>}
    }

    sendOtpRequest = ()=>{
      let {mobileNumber} = this.state;
      if(mobileNumber.length === 0 || mobileNumber.length > 10){
        this.setErrorMsg('Mobile number is invalid')
        return
      }else{
        this.props.sendOtp({mobileNumber},()=>{
          if(this.props.otpResponse.success === true){
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

    changePassword = ()=>{
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

            if(!this.state.passwordChangeSuccess){
        return (     
        <React.Fragment>
          {!this.state.changePassword?<button className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default font-weight-bold h2" onClick={()=>{
            this.setState({
              changePassword:true
            })
          }} 
          style={{fontFamily: "Noto Sans",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center"
        }}
        > RESET PASSWORD</button> :null} 
        <hr className="hr-line" />
        {this.state.changePassword?
        <React.Fragment>
        
        <div className="form-group">
                <input
                  type="password"
                  className="form-control text-input"
                  id="exampleInputPassword1"
                  placeholder="Enter Current Password"
                  value={this.state.oldPassword}
                  onChange={e => {
                    this.validatePassword(e);
                    this.setState({
                      oldPassword:e.target.value
                    })
                  }}
                  onBlur={this.validatePassword}
                />
              </div>
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
              Passwords do
               not match.
            </p>:null}
            <button className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default font-weight-bold h2" onClick={()=>{
            this.sendOtpRequest()
          }} 
          style={{fontFamily: "Noto Sans",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center"
        }}
        disabled={this.state.disableMobileOtp}
        > SEND OTP</button>
        <p className="text-white text-justify">
            If you do not receive a code within 30 seconds, please press Send OTP.
            </p>
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
                      this.props.verifyOtp({mobileNumber:this.state.mobileNumber,otp:this.state.otpValue},()=>{
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
        {this.confirmButton("password")}
        </React.Fragment>:null}</React.Fragment>)}else{
        return <React.Fragment>
           <div className="d-flex-column justify-content-center" > 
            <p style={{
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: "24px",
              lineHeight: "32px",
              textAlign: "center",
              color: "#2FC8AD",
            }}>Password changed! </p>
            <p className="text-white" > The name registered with this account has been changed from {this.state.name} to {this.state.newName} </p> 
           </div>
      </React.Fragment>}
    }

    changeMobileNumber = ()=>{
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

      if(!this.state.mobileChangeSuccess){
        return (     
        <React.Fragment>
          {!this.state.changeMobileNumber?<button className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default font-weight-bold h2" onClick={()=>{
            this.setState({
              changeMobileNumber:true
            })
          }} 
          style={{fontFamily: "Noto Sans",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center"
        }}
        > CHANGE MOBILE NUMBER</button> :null} 
        <hr className="hr-line" />
        {this.state.changeMobileNumber?
        <React.Fragment>
        <div className="form-group">
                      <input
                        type="password"
                        className="form-control text-input"
                        id="exampleInputPassword1"
                        placeholder="Enter your Password"
                        value={password}
                        onChange={e => {
                          this.validatePassword(e);
                          this.setPassword(e.target.value);
                        }}
                        onBlur={this.validatePassword}
                      />
                    </div>
                    <p className="text-white" >New Mobile Number</p>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control text-input"
                        id="exampleInputPassword1"
                        placeholder="New Mobile Number"
                        value={this.state.newMobileNumber}
                        onChange={e => {
                          this.setState({
                            newMobileNumber:e.target.value
                          })
                        }}
                      />
                    </div>
                    <button className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default font-weight-bold h2" onClick={()=>{
                  this.props.history.push({  pathname:'/navigate',search:`${this.state.currentVenue.venueName}&&${this.state.currentBuilding.buildingName}`})
                }} 
                style={{fontFamily: "Noto Sans",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: "16px",
                lineHeight: "24px",
                textAlign: "center"
              }}
              > SEND OTP</button>
              <p className="text-white" > Please check your registered e-mail ID for the OTP. If you do not receive a code within 1 minute, please press Send OTP again. </p>
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
              {this.confirmButton("mobile")}
        </React.Fragment>:null}</React.Fragment>)}else{
          return <React.Fragment>
           <div className="d-flex-column justify-content-center" > 
            <p style={{
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: "24px",
              lineHeight: "32px",
              textAlign: "center",
              color: "#2FC8AD",
            }}>Mobile Number changed! </p>
            <p className="text-white" > The name registered with this account has been changed from {this.state.name} to {this.state.newName} </p> 
           </div>
      </React.Fragment>}
    }

    changeEmail = ()=>{
      let {
        password,
        emailOtpValue
      } = this.state;
      

      if(!this.state.emailChangeSuccess){
        return (     
        <React.Fragment>
          {!this.state.changeEmail?<button className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default font-weight-bold h2" onClick={()=>{
            this.setState({
              changeEmail:true
            })
          }} 
          style={{fontFamily: "Noto Sans",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center"
        }}
        > CHANGE EMAIL ID</button> :null} 
        <hr className="hr-line" />
        {this.state.changeEmail?
        <React.Fragment>
              <div className="form-group">
                      <input
                        type="password"
                        className="form-control text-input"
                        id="exampleInputPassword1"
                        placeholder="Enter your Password"
                        value={password}
                        onChange={e => {
                          this.validatePassword(e);
                          this.setPassword(e.target.value);
                        }}
                        onBlur={this.validatePassword}
                      />
                    </div>
                    <p className="text-white" >New Email Id</p>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control text-input"
                        id="exampleInputPassword1"
                        placeholder="New Email ID"
                        style={{
                          color:"white"
                        }}
                        value={this.state.newEmail}
                        onChange={e => {
                          this.setState({
                            newEmail:e.target.value
                          })
                        }}
                        onBlur={this.validatePassword}
                      />
                    </div>
                    <button className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default font-weight-bold h2" onClick={()=>{
                  this.props.history.push({  pathname:'/navigate',search:`${this.state.currentVenue.venueName}&&${this.state.currentBuilding.buildingName}`})
                }} 
                style={{fontFamily: "Noto Sans",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: "16px",
                lineHeight: "24px",
                textAlign: "center"
              }}
              > SEND OTP</button>
              <p className="text-white" > Please check your registered e-mail ID for the OTP. If you do not receive a code within 1 minute, please press Send OTP again. </p>
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
              {this.confirmButton("email")}
        </React.Fragment>:null}</React.Fragment>)}else{
          return <React.Fragment>
           <div className="d-flex-column justify-content-center" > 
            <p style={{
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: "24px",
              lineHeight: "32px",
              textAlign: "center",
              color: "#2FC8AD",
            }}>Email Id changed! </p>
            <p className="text-white" > The name registered with this account has been changed from {this.state.name} to {this.state.newName} </p> 
           </div>
      </React.Fragment>}
    }

     render(){
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
         return (
           <div className="bg-settings container-fluid" style={{height:this.state.click?"100%":"100vh"}}>
             <div className="text-white row mt-5">
               <div className="col-lg-12 text-center">
                     <img
                       className="mt-1"
                       src="/inclunav/assets/images/user_profile_inverted.svg"
                       alt="user profile"
                     />
               </div>
             </div>

             <div className="text-white row mt-5" onClick={()=>{this.setState({
               updateName:!this.state.updateName,
               click:false
             })}} >
               <div className="col-10 ">
                   Name:  {this.state.name}
               </div>
               <div className="col-2 ">
                    <img
                       className="mt-1"
                       src="/inclunav/assets/images/pen.svg"
                       alt="user profile"
                    />
               </div>
             </div>
             
             {this.state.updateName?
             <React.Fragment>
               {this.changeName()}
               </React.Fragment>
             :null}
             <div className="text-white row mt-5" onClick={()=>{this.setState({
               updatePassword:!this.state.updatePassword,
               click:!this.state.click
             })}} >
               <div className="col-10 ">
                   Password:  *********
               </div>
               <div className="col-2 ">
                    <img
                       className="mt-1"
                       src="/inclunav/assets/images/pen.svg"
                       alt="user profile"
                    />
               </div>
             </div>
             {this.state.updatePassword?
             <React.Fragment>
               {this.changePassword()}
               </React.Fragment>
             :null}
              <div className="text-white row mt-5" onClick={()=>{this.setState({
               updateMobileNumber:!this.state.updateMobileNumber,
               click:!this.state.click
             })}} >
                <div className="col-10 ">
                    Mobile Number:  {this.state.mobileNumber}
                </div>
                <div className="col-2 ">
                     <img
                        className="mt-1"
                        src="/inclunav/assets/images/pen.svg"
                        alt="user profile"
                     />
                </div>
              </div>
              {this.state.updateMobileNumber?
             <React.Fragment>
               {this.changeMobileNumber()}
               </React.Fragment>
             :null}
              <div className="text-white row mt-5" onClick={()=>{this.setState({
               updateEmail:!this.state.updateEmail,
               click:!this.state.click

             })}} >
                <div className="col-10 ">
                    Email:  {this.state.email}
                </div>
                <div className="col-2 ">
                     <img
                        className="mt-1"
                        src="/inclunav/assets/images/pen.svg"
                        alt="user profile"
                     />
                </div>
              </div>
              {this.state.updateEmail?
             <React.Fragment>
               {this.changeEmail()}
               </React.Fragment>
             :null}
           </div>
         );
     }
}

const mapStateToProps = state => {
  return {
    userInformation: state.userInformation,
    nameChange:state.updateName,
    passwordChange:state.updatePassword,
    mobileChange:state.updateMobile,
    emailChange:state.updateEmail,
    otpResponse: state.sendOtp,
    otpVerifyResponse: state.verifyOtp,
  };
};

export default connect(mapStateToProps, {
  getUserInformation,
  updateName,
  updatePassword,
  updateMobile,
  updateEmail,
  sendOtp, 
  verifyOtp
})(ProfileSettings);
