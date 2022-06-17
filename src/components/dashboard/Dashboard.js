import React from "react";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "./css/dashboard.css";
import {
  floorList,
  imgDetails,
  getAllBuildingElements,
  venueList,
  buildingList
} from "../../store/actions/index";
import { connect } from "react-redux";
import Navigation from "./navigation/Navigation";
import Landing from "./Landing";
import { Route } from "react-router-dom";
import Settings from "./Settings";
import ProfileSettings from "./ProfileSettings";
import NavigationSettings from "./NavigationSettings";
import InclusiveNavigation from "./navigation/InclusiveNavigation";
import GlobalView from "./global/GlobalView";

const routes = [
  {
    path: "/navigate",
    component: Navigation
  },
  {
    path: "/dashboard",
    component: Landing
  },
  {
    path: "/settings",
    component: Settings
  },
  {
    path: "/profile-settings",
    component: ProfileSettings
  },
  {
    path: "/navigation-settings",
    component: NavigationSettings
  },
  {
    path: "/inclusive",
    component: InclusiveNavigation
  },
  {
    path: "/global-view",
    component: GlobalView
  }
];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarLeft: false,
      gpsLocation: "",
      currentBuilding: null,
      currentVenue: null,
      currentTab: "DASHBOARD"
    };
  }

  componentDidMount() {
    var str = window.location.href;
    let sentence = str.split("/");
    if (sentence[sentence.length - 1] === "settings") {
      this.setState({
        currentTab: "SELECT SETTINGS"
      });
    } else if (sentence[sentence.length - 1] === "profile-settings") {
      this.setState({
        currentTab: "USER PROFILE"
      });
    } else if (sentence[sentence.length - 1] === "navigation-settings") {
      this.setState({
        currentTab: "SETTINGS"
      });
    } else if (sentence[sentence.length - 1].split("?")[0] === "global-view") {
      console.log("vakj")
      this.setState({
        currentTab: "NAVIGATE"
      });
    } else {
      this.setState({
        currentTab: "DASHBOARD"
      });
    }
  }

  render() {
    const routeComponents = routes.map(({ path, component, i }) => (
      <Route path={path} component={component} key={i} />
    ));
    let content;
    if (this.props.navContent !== null) {
      content = this.props.navContent;
    } else {
      content = this.state.currentTab;
    }
    return (
      <div
        className={
          this.state.currentTab !== "DASHBOARD"
            ? "settings-height"
            : "landing-height"
        }
      >
        <nav
          className="navbar navbar-expand-lg nav-bg text-white fixed-top"
          id="nav-height"
          style={{
            background:
              this.state.currentTab !== "DASHBOARD" ? "#3D3F47" : "#27282d"
          }}
        >
          <div className="row w-100">
            <div className="col-2">
              <button
                className="btn"
                type="button"
                aria-label="Go Back"
                onClick={() => {
                  this.props.history.goBack();
                  // window.location.reload()
                }}
              >
                <img src="/inclunav/assets/images/back.svg" alt="back button" />
              </button>
            </div>
            <div className="col-8 text-center my-auto">{content}</div>
            <div className="col-2 text-center">
              <button
              style={{
                background: 'inherit',
                border: 'inherit',
                marginTop: 8
              }}
                type="button"
                aria-label="Go to Settings Page"
                onClick={() => {
                  this.props.history.push("/settings");
                }}
              >
                <img
                  src="/inclunav/assets/images/settings.svg"
                  alt="settings button"
                />
              </button>
            </div>
          </div>
        </nav>
        {routeComponents}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    getImage: state.imgDetails,
    allNodes: state.getAllElem,
    flrList: state.floorList,
    navigationInfo: state.navigationInfo,
    vnList: state.venueList,
    bldList: state.buildingList,
    navContent: state.navContent
  };
};

export default connect(mapStateToProps, {
  floorList,
  imgDetails,
  getAllBuildingElements,
  venueList,
  buildingList
})(Dashboard);
