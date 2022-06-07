import React from "react";
import { css } from "@emotion/css";
import Drawer from "react-drag-drawer";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "./css/dashboard.css";
import {
  floorList,
  imgDetails,
  getAllBuildingElements,
  venueList,
  buildingList,
  getGpsLocation
} from "../../store/actions/index";
import { connect } from "react-redux";
import Navigation from "./navigation/Navigation";
import { Link, Route } from "react-router-dom";
import { Map, TileLayer } from "react-leaflet";
import L from "leaflet";

const routes = [
  {
    path: "/test",
    component: Navigation
  }
];

const center = { lat: 28.6139, lng: 77.209 };

const Card = css`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 40px auto;
  @media (min-width: 768px) {
    border-radius: 0;
  }
  button {
    margin-top: 50px;
  }
`;

const Toggle = css`
  background-color: #d50152;
  border-radius: 4px;
  color: white;
  border: 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  margin-left: 50%;
  margin-top: 0px !important;
  transition: all 0.25s linear;
  &:active {
    transform: scale(0.9);
  }
`;

const modal = css`
  position: absolute;
  top: 30px;
  background-color: white;
  width: 100%;
  max-width: 700px;
  min-height: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const Sidebar = css`
  ${modal} top: 0;
  max-width: 300px;
  border-radius: 0;
  left: 0;
  background: linear-gradient(to bottom, #09203f, #1d4a6d);
`;

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarLeft: false,
      gpsLocation: "",
      currentLocation: "",
      currentVenue: {
        address: "",
        coordinates: [],
        dateCreated: "",
        distance: 2,
        id: 0,
        liveStatus: true,
        organization: "",
        venueName: ""
      },
      currentBuilding: {
        address: "",
        buildingName: "",
        coordinates: [],
        distance: 2,
        lat: 0,
        lng: 0
      }
    };
  }

  componentDidMount() {
    if (window.navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success => {
        let coordinates = [success.coords.latitude, success.coords.longitude];
        const geocoder = L.Control.Geocoder.nominatim();
        let lat = coordinates[0];
        let lng = coordinates[1];
        this.props.getGpsLocation({ lat, lng }, () => {
          console.log("gps location", this.props.gpsLocation);
          this.setState({
            currentLocation: this.props.gpsLocation.display_name
          });
        });
        this.getVenueList(coordinates);
      });
    } else {
      // x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  getVenueList = coordinates => {
    this.props.venueList(() => {
      this.setState(
        {
          venueList: this.props.vnList.data
        },
        () => {
          this.findNearVenue(coordinates);
        }
      );
    });
  };

  findNearVenue = coordinates => {
    let { venueList } = this.state;
    let distList = venueList.map(r => {
      return this.getDistance(coordinates, r);
    });
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    let nearLocation;
    for (var i = distList.length - 1; i >= 0; i--) {
      tmp = distList[i].distance;
      if (tmp < lowest) {
        nearLocation = distList[i];
        lowest = tmp;
      }
      if (tmp > highest) highest = tmp;
    }
    if (lowest < 1) {
      this.setState(
        {
          gpsLocation: nearLocation.address,
          currentVenue: nearLocation
        },
        () => {
          this.getBuildingList(nearLocation.venueName, coordinates);
        }
      );
    }
  };

  getBuildingList = (venueName, coordinates) => {
    this.props.buildingList({ venueName: "IITCampusCheck" }, () => {
      this.setState(
        {
          buildingList: this.props.bldList.data
        },
        () => {
          if (this.state.buildingList.length > 0) {
            this.findNearBuilding(coordinates);
          }
        }
      );
    });
  };

  findNearBuilding = coordinates => {
    let { buildingList } = this.state;
    let distList = buildingList.map(r => {
      let p = [r.lat, r.lng];
      r.coordinates = p;
      return this.getDistance(coordinates, r);
    });
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    let nearLocation;
    for (var i = distList.length - 1; i >= 0; i--) {
      tmp = distList[i].distance;
      if (tmp < lowest) {
        nearLocation = distList[i];
        lowest = tmp;
      }
      if (tmp > highest) highest = tmp;
    }
    console.log("current buildingh", nearLocation);
    if (lowest < 0.1) {
      this.setState(
        {
          gpsLocation: nearLocation.address,
          currentBuilding: nearLocation
        },
        () => {
          console.log("building list", this.state.currentBuilding);
          // this.getBuildingList(nearLocation.venueName,coordinates)
        }
      );
    }
  };

  rad = function(x) {
    return (x * Math.PI) / 180;
  };

  getDistance = function(p1, p2) {
    // console.log("p1 and p2",p1,p2)
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(p2.coordinates[0] - p1[0]);
    var dLong = this.rad(p2.coordinates[1] - p1[1]);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1[0])) *
        Math.cos(this.rad(p2.coordinates[0])) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = (R * c) / 1000;
    p2.distance = d;
    return p2; // returns the distance in km
  };

  render() {
    const { sidebarLeft } = this.state;

    const routeComponents = routes.map(({ path, component, i }) => (
      <Route path={path} component={component} key={i} />
    ));

    return (
      <React.Fragment>
        {this.state.gpsLocation.length > 0 ? (
          <div className="row w-100" style={{ position: "absolute" }}>
            <div className="col-11 pr-0">
              <div className="gps-location text-white">
                <img
                  className="float-left ml-2 mt-3"
                  src="/inclunav/assets/images/user_location.png"
                  alt="current location"
                />
                <p className="text-justify w-75 mx-auto my-auto">
                  {this.state.currentLocation}
                </p>
              </div>
            </div>
            <div className="col-1 ">
              <button className="ellipse">
                <img
                  className="mx-auto my-auto"
                  src="/inclunav/assets/images/share.png"
                />
              </button>
            </div>
          </div>
        ) : null}
        <div
          className="bg-dashboard container-fluid d-flex justify-content-center align-items-center h-95"
          style={{ marginTop: "50px" }}
        >
          <div className="text-white row ">
            <div className="col-lg-12 ">
              <div className="text-center" id="content">
                <button
                  className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default font-weight-bold h2"
                  onClick={() => {
                    this.props.history.push({
                      pathname: "/navigate",
                      search: `${this.state.currentVenue.venueName}&&${this.state.currentBuilding.buildingName}`
                    });
                  }}
                >
                  <img
                    className="float-left"
                    src="/inclunav/assets/images/navigate.png"
                    alt="navigate button"
                  />
                    <span aria-hidden="true" > Navigate </span> <span class="sr-only">Double tap to continue</span>
                </button>
                <button className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default font-weight-bold  h2">
                  <img
                    className="float-left"
                    src="/inclunav/assets/images/explore.png"
                    alt="explore button"
                  />
                   <span aria-hidden="true" > Explore </span>  <span class="sr-only">Double tap to continue</span>
                </button>
                <button className="btn btn-dashboard  mx-auto btn-block btn-default font-weight-bold  h2">
                  <img
                    className="float-left"
                    src="/inclunav/assets/images/location_info.png"
                    alt="location information button"
                  />
                  <p className="btn-dashboard-text-location">
                  <span aria-hidden="true" > Location Information </span>  <span class="sr-only">Double tap to continue</span> 
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    getImage: state.imgDetails,
    allNodes: state.getAllElem,
    //   bList: state.buildingList,
    flrList: state.floorList,
    navigationInfo: state.navigationInfo,
    vnList: state.venueList,
    bldList: state.buildingList,
    gpsLocation: state.gpsLocation
  };
};

export default connect(mapStateToProps, {
  floorList,
  imgDetails,
  getAllBuildingElements,
  venueList,
  buildingList,
  getGpsLocation
})(Landing);
