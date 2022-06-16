import React from "react";
import { Link } from "react-router-dom";
import { userLogin } from "../../store/actions";
import { connect } from "react-redux";

class UserLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: "",
      password: "",
      errorMsg: "",
      viewPass: false,
      emailRead: false,
      passRead: false
    };
  }
/**
 * @id N1.1.1
 * @author Pankaj Singh
 * @description  Initial Rendering
 */
  /*componentDidMount() {
    let token = localStorage.getItem("token");
    console.log(token)
    if (token) {
      this.props.history.push("/global-view");
    }
  }*/
/**
 * @id N1.1.2
 * @author Pankaj Singh
 * @description  passing mobile number and password to https://inclunav.apps.iitd.ac.in/node/wayfinding/v1/login 
 */
  loginRequest = () => {
    let { mobileNumber, password } = this.state;
    const re = /^[0-9\b]+$/;
    if (
      mobileNumber.length === 0 ||
      mobileNumber.length >= 11 ||
      !re.test(mobileNumber)
    ) {
      this.setState({
        errorMsg: "Invalid Mobile Number."
      });
      return;
    } else if (password.length === 0) {
      this.setState({
        errorMsg: "Password Required"
      });
      return;
    } else {
      this.props.userLogin({ mobileNumber, password, mode: "manual" }, () => {
        let { loginResponse } = this.props;
        if (loginResponse !== null) {
          if (loginResponse.success === true) {
            localStorage.setItem("id", loginResponse.data.id);
            localStorage.setItem("token", loginResponse.token);
            this.props.history.push("/global-view");
          } else {
            var utter = new window.SpeechSynthesisUtterance(
              "Mobile number or password is incorrect. Please try again."
            );
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
            this.setState({
              errorMsg:
                "Mobile number or password is incorrect. Please try again."
            });
          }
        }
      });
    }
  };
/**
 * @id N1.1.3
 * @author Pankaj Singh
 * @description  update state mobile number 
 */
  handleInput = e => {
    this.setState({
      mobileNumber: e.target.value
    });
  };

  render() {
    let { mobileNumber, password, errorMsg, viewPass } = this.state;
    return (
      <div className="landing-height">
        <nav className="navbar navbar-expand-lg nav-bg text-white">
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Go back"
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            <img
              src="/inclunav/assets/images/back_arrow.png"
              alt="back button"
            />
          </button>
          <div className="mx-auto">
            <span className="sr-only">
              Welcome to Inclunav Routes, Sign In or Sign Up
            </span>
            <span aria-hidden="true" tabindex="-1">
              SIGN IN / SIGN UP
            </span>
          </div>
        </nav>
        <div className="bg-landing container-fluid d-flex h-100">
          <div className="text-white row  mx-auto">
            <div className="col-lg-12 mt-5">
              <div className="text-center pl-3 pr-3" id="content">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control text-white text-input"
                    placeholder="Enter Mobile Number"
                    name="mobileNumber"
                    value={mobileNumber}
                    onChange={this.handleInput}
                    readOnly={this.state.emailRead}
                    onBlur={() => {
                      this.setState({
                        emailRead: true
                      });
                    }}
                    onFocus={() => {
                      this.setState({
                        emailRead: false
                      });
                    }}
                  />
                </div>
                <div
                  className={
                    errorMsg.length > 0 ? "form-group" : "form-group mb-5 pb-4"
                  }
                  id="container"
                >
                  <div class="input-group">
                    <input
                      type={!viewPass ? "password" : "text"}
                      className="form-control text-white text-input psswd"
                      placeholder="Enter Password"
                      value={password}
                      onChange={e => {
                        this.setState({
                          password: e.target.value
                        });
                      }}
                      readOnly={this.state.passRead}
                      onBlur={() => {
                        this.setState({
                          passRead: true
                        });
                      }}
                      onFocus={() => {
                        this.setState({
                          passRead: false
                        });
                      }}
                    />
                    <div
                      className="show-pass"
                      onClick={() => {
                        this.setState({
                          viewPass: !this.state.viewPass
                        });
                      }}
                    >
                      {!viewPass ? (
                        <img
                          src="/inclunav/assets/images/hide_view.png"
                          alt="hide password"
                        />
                      ) : (
                        <img
                          src="/inclunav/assets/images/show_view.png"
                          alt="show password"
                        />
                      )}
                    </div>
                  </div>
                </div>
                {errorMsg.length > 0 ? (
                  <p className="text-error">{errorMsg}</p>
                ) : null}
                <button
                  className="btn btn-language  mx-auto btn-block btn-default btn-lg font-weight-bold  h2"
                  onClick={this.loginRequest}
                >
                  <span aria-hidden="true"> Sign In</span>{" "}
                  <span class="sr-only">Double tap to login</span>
                </button>
                <div>
                  <span className="sr-only"> Forgot Password </span>
                  <Link
                    to="/forgot-password"
                    className="forgot-pass mx-auto mt-4 mb-4 h-0"
                    aria-hidden="true"
                    aria-label="Go to forgot password page"
                  >
                    Forgot Password
                  </Link>
                </div>
                <hr className="login-hr" />
                <button
                  className="btn btn-language  mx-auto btn-block btn-default btn-lg font-weight-bold  h2"
                  onClick={() => {
                    this.props.history.push("/register");
                  }}
                >
                  <span aria-hidden="true"> Sign Up </span>{" "}
                  <span class="sr-only">Double tap to to got Sign Up page</span>
                </button>
                <span className="sr-only"> Customer Support </span>
                <Link
                  to="/contact"
                  className="forgot-pass mx-auto mt-4 mb-4 h-0"
                  aria-hidden="true"
                >
                  Customer Support
                </Link>
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
    loginResponse: state.userLogin
  };
};

export default connect(mapStateToProps, {
  userLogin
})(UserLogin);
